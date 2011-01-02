$( function() {
    // External images don't load in Firefox and
    // image sizing is incorrect in Chrome 10
    // so this replaces the image elements with
    // inline svgs.
    $('image').each(function() {
        var $image = $(this);
        var link = $image.attr( 'xlink:href' );
        if( !link ) link = $image.attr('href');
        if( link[0] != '#' && link.substring( link.length - 4 ) == '.svg' ) { // non-local svg image
            $.get( link, function( data ) {
                var $svg = $(data.documentElement);
                $(['x', 'y', 'width', 'height']).each( function( idx, val ) {
                    if( $image.attr( val ) != undefined ) {
                        $svg.attr( val, $image.attr( val ) );
                    }
                });
                $image.replaceWith( $svg );
            })
        }
    })

//     $.fx.step[ 'transform' ] = function(fx) {
//         if(!fx.transformInit) {
//             fx.$elem = $(fx.elem)
//             //fx.start = fx.elem.getScreenCTM();
//             fx.start = getMatrix( fx.$elem.attr('transform') );
//             fx.end = getMatrix( fx.end );
//             //fx.end = getRGB(fx.end);
//             fx.transformInit = true;
//         }


//         fx.$elem.attr( 'transform', 'matrix(' + ( ( fx.start.a + (fx.end.a - fx.start.a) * fx.pos ) + ','
//                                                  + ( fx.start.b + (fx.end.b - fx.start.b) * fx.pos ) + ','
//                                                  + ( fx.start.c + (fx.end.c - fx.start.c) * fx.pos ) + ','
//                                                  + ( fx.start.d + (fx.end.d - fx.start.d) * fx.pos ) + ','
//                                                  + ( fx.start.e + (fx.end.e - fx.start.e) * fx.pos ) + ','
//                                                  + ( fx.start.f + (fx.end.f - fx.start.f) * fx.pos ) ) + ')' );
//         console.log(fx.$elem.attr('transform'));
//     };


    console.log( 'exe' );
    var $root = $(document.documentElement);
    $root.find( '[class="menuitem"]' ).each( function() {
        var $item = $(this);
        $item.click( function() {
            var $item = $(this);
            var showsub = ! $item.data( 'showsub' );
            $item.data( 'showsub', showsub )
            $item.parents().andSelf().each( function() {
                var $parent = $(this);
                
                if( showsub ) {
                    $parent.data( 'transform', $parent.attr( 'transform' ) );
                    $parent.animate( {
                        transform : 'matrix(1,0,0,1,0,0)',
                    } );
                } else {
                    $parent.animate( {
                        transform : $parent.data( 'transform' ),
                    } );
                }
            } );
            if( showsub ) {
                $root.data( 'viewBox', $root.attr( 'viewBox' ) );
                $root.animate( {
                    //viewBox : '0 0 ' + $item.width() + ' ' + $item.height(),
                    svgViewBox : '0 0 100 100', // ToDo: dynamically determine width and height
                } )
            } else {
                $root.animate( {
                    svgViewBox : $root.data( 'viewBox' ),
                } )
            }
        } );
    } )
} )

      //console.log( document.createElementNS( 'http://www.w3.org/2000/svg', 'g' ) );
      //$root.append( $('<g/>').append( $root.children() ) );
      //$root.append( document.createElementNS( 'http://www.w3.org/2000/svg', 'g' ) );
      //$root.get( 0 ).appendChild( document.createElementNS( 'http://www.w3.org/2000/svg', 'svg:g' ) );
      //console.log( $root.children().size() );
