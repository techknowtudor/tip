<?php get_header(); ?>
<?php if ( have_posts() ) : while ( have_posts() ) : the_post(); ?>
	<div class="image">
	<div class="nav prev"><?php next_post_link( '%link' ); ?></div>
	<?php image_html(); ?>
	<div class="nav next"><?php previous_post_link( '%link' ); ?></div>
	</div>
	
	<?php partial( 'post' ); ?>
<?php endwhile; else : ?>
	<h2><?php _e( 'Not Found', 'duotone' ); ?></h2>
	<p><?php _e( "Sorry, but you are looking for something that isn't here.", 'duotone' ); ?></p>
	<?php get_search_form(); ?>
<?php endif; ?>
<?php get_footer(); ?>
