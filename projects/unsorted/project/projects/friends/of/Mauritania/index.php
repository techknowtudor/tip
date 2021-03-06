<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en">
  <head>
    <meta name="keywords" content="Mauritania, RIM, West Africa, Nouakchott, Peacecorps" />
    <title>FORIM - Friends of Mauritania</title>
    <link rel='stylesheet' href='forim.css' type='text/css' />
    <!--[if lt IE 7]>
    <link rel='stylesheet' href='forim.ie6.css' type='text/css' />
    <![endif]-->
    <script src="http://www.google-analytics.com/urchin.js" type="text/javascript"></script>
    <script type="text/javascript">
      _uacct = "UA-2592249-2";
      urchinTracker();
    </script>
  </head>
  <body>
    <div id="header">
      <img src="http://www.forim.org/gallery/main.php?g2_view=core.DownloadItem&amp;g2_itemId=21" alt="Friends of Mauritania" />
    </div>
    <h1><a href="background.html">Friends of the Republique Islamique de Mauritanie (FORIM)</a></h1>

    <div id="announce">
      <a class="announce" href="http://www.forim.org/gallery/d/302-1/La+Perle+-+Thirteenth+Edition_+Winter+2008.pdf">The Winter 2008 Edition of La Perle is now available</a>
      <!--<a class="announce" href="membership.html">Join FORIM today and support our work</a>-->
      <p class="announce"><acronym title="Friends of Mauritania">FORIM</acronym> is currently on hiatus for lack of willing leadership</p>
      <a class="announce" href="http://groups.google.com/group/forim">Stay in Touch: Join the FORIM Google Group</a>
    </div>

    <ul id="navigation">
      <li><a href="background.html">What is FORIM?</a></li>
      <li><a href="news.html">FORIM News</a></li>
      <!--<li><a href="membership.html">Membership Registration</a></li>-->
      <li><a href="gallery/">Pictures</a></li>
      <li><a href="special_projects.html">Special Projects</a></li>
      <li><a href="links.html">Mauritania Links</a></li>
      <li><a href="newsletter.html">La Perle Newsletter</a></li>
      <li><a href="contact.html">Contact Information</a></li>
      <li><a href="minutes/">Meeting Minutes</a></li>
    </ul>

    <hr />

<?php
$files = array_merge(glob("*php"), glob("*html"), glob("*/*html"));
$maxtime = 0;
$maxfile;
foreach($files as $file) {
  $filetime = filemtime($file);
  if($filetime > $maxtime) {
    $maxtime = $filetime;
    $maxfile = $file;
  }
}
?>
    <div id="footer">
      <div>Friends of Mauritania</div>
      <div>PO Box 33068</div>
      <div>Washington, DC 20033-0068</div>
      <hr style="width: 30%" />
      <h3><?php printf("<a href='%s'>Last Updated</a>: %s", $maxfile, date("d F Y", $maxtime)) ?></h3>
    </div>
  </body>
</html>
