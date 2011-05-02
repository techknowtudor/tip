DECLARE @startIds TABLE ( id INT PRIMARY KEY )

--INSERT INTO @startIds SELECT TOP 1 id FROM #ObjectRelations
--;WITH 
--        Ids (Id) AS ( SELECT competency_id FROM rpt_competency_ge2013_tree_map ),
--   childIds (Id) AS ( SELECT child_id      FROM rpt_competency_ge2013_tree_map )
INSERT INTO @startIds
--  SELECT DISTINCT Ids.Id FROM Ids
--    LEFT JOIN childIds on Ids.Id = childIds.Id
--    WHERE childIds.Id IS NULL
  SELECT DISTINCT id FROM rpt_competency_ge2013

--		SELECT competency_id, class_of_desc,
--		       AVG(score) AS avg, STDEV(score) as stddev, COUNT(score) as count
--
--SELECT c.id AS competency_id, s.id AS score_id, score, student_id
--					FROM [dbo].[rpt_competency_ge2013] c
--						INNER JOIN [dbo].[rpt_competency_ge2013_score] s ON c.id = s.competency_id

;WITH Leaves ( id, child_id, depth, path ) AS
( SELECT tree.competency_id, tree.child_id, 1, '|' + CAST(tree.competency_id AS VARCHAR(MAX)) + '|'
    FROM rpt_competency_ge2013_tree_map tree
    WHERE tree.competency_id IN ( SELECT id FROM @startIds )
  UNION ALL
  SELECT containing_tree.id, tree.child_id, depth + 1, containing_tree.path  + '|' + CAST(tree.competency_id AS VARCHAR(MAX)) + '|'
    FROM rpt_competency_ge2013_tree_map tree
    INNER JOIN Leaves containing_tree -- recursive join
      ON containing_tree.child_id = tree.competency_id
   WHERE containing_tree.path NOT LIKE '%|' + CAST(tree.competency_id AS VARCHAR(MAX)) + '|%' -- Avoid cycles
)
SELECT Leaves.id, AVG( score )
FROM  Leaves
INNER JOIN rpt_competency_ge2013_score score ON Leaves.child_id = score.competency_id
GROUP BY Leaves.id
