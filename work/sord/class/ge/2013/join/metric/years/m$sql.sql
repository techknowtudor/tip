--USE [sord_dev_will]
--GO
--EXEC [dbo].[rpt_competency_ge2013_proc]
--GO

DECLARE @competency_id INT
SET @competency_id = 3003
DECLARE @root_id INT
SET @root_id = 1

DECLARE @year INT

DECLARE @values TABLE( title VARCHAR(MAX), value REAL, year INT, [order] INT )

INSERT INTO @values ( title, value, year, [order] )
  SELECT title, value, student_class_of, [order]
    FROM rpt_competency_ge2013_metric metric
    INNER JOIN rpt_competency_ge2013_func func ON func.id = metric.func_id
    WHERE competency_id = @competency_id

--INSERT INTO @values ( title, value, year, [order] )
--SELECT title, value, student_class_of, [order]

INSERT INTO @values ( title, value, year, [order] )
  SELECT title, NULL, year, [order]
    FROM (
      SELECT DISTINCT student_class_of AS year
        FROM rpt_competency_ge2013_metric metric
        WHERE competency_id = @root_id
        AND ( @year IS NULL OR @year = 0 OR student_class_of IN ( @year ) )
    ) all_years
    CROSS JOIN rpt_competency_ge2013_func func
    WHERE all_years.year NOT IN ( SELECT year FROM @values )

SELECT title, value, year, [order] FROM @values ORDER BY [order] ASC