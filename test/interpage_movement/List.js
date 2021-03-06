if( ! Array.prototype.each ) {
    if( typeof console != 'undefined' ) console.log( "missing:Array.each" );
}

function List( ) {
    var keys = [];
    var itms = {};
    var store = this;
    var id = 0;
    var builtin = {};
    var self = this;

    function add( itm, uid ) {
        var key = uid || id++;
        if( keys.indexOf( key ) < 0 ) {
            ptr( key, itm );
            keys.push( key );
            //console.log('a:'+key+':'+get(key));
        }
        return key;
    }
    this.add = add;

    function ptr( key, itm ) {
        if( typeof silent != 'undefined' && ! silent && typeof console != 'undefined' ) {
            console.log( 'θ:⒧:' + key + ' ⬌ ' + itm );
        }
        self.__defineGetter__( key, function() { return get( key ) } );
        return itms[ key ] = new Pointer( itm );
    }
    
    this.swap = function( a, b ) {
        var tmp = itms[ a ];
        itms[ a ] = itms[ b ];
        itms[ b ] = tmp;
        return this;
    }

    function merge( obj ) {
        if( obj !== undefined ) {
            if( typeof obj == 'string' && obj.test( /^{.*}$/ )  ) {
                obj = JSON.parse( obj );
            }
            if( obj.each ) {
                obj.each( function( val, key ) {
                    set.apply( self, [ key, val ] )
                } )
            } else {
                for( prop in obj ) {
                    var cur = get( prop )
                    if( cur instanceof List ) {
                        cur.merge.apply( cur, [ obj[ prop ] ] )
                    } else {
                        set.apply( self, [ prop, obj[prop] ] )
                    }
                }
            }
        }
        return this
    }
    this.merge = merge;
    merge.apply( this, arguments );

    function entangle( obj ) {
        if( obj !== undefined ) {
            if( typeof obj == 'string' && obj.test( /^{.*}$/ )  ) {
                obj = JSON.parse( obj );
            }
            if( obj.each ) {
                obj.each( function( val, key ) {
                    var ptr = new MapPointer( obj, key );
                    add( ptr, key );
                } );
            } else {
                for( prop in obj ) {
                    var cur = get( prop );
                    if( cur instanceof List ) {
                        cur.merge( obj[ prop ] );
                    } else {
                        var ptr = new MapPointer( obj, prop );
                        add( ptr, prop );
                    }
                }
            }
        }
        return this
    }
    
    this.join = function() {
    }

    this.on = function( key, f ) {
        var orig = this[ key ];
        this[ key ] = function() {
            var self = arguments.callee;
            var args = Array.prototype.slice.call( arguments );

            if( f.pre ) f.pre.apply( this, arguments );
            if( typeof silent != 'undefined' && ! silent && typeof console != 'undefined' ) {
                console.log( self.asString + ':' + key );
            }
            var ret = orig.apply( this, arguments );
            if( typeof silent != 'undefined' && ! silent && typeof console != 'undefined' ) {
                console.log( self.asString + 'ʹ:' + key + ':' + ret );
            }
            try {
                args.push( ret );
                f.apply( this, args );
            } catch( e ) {
                if( e && e['return'] ) {
                    ret = e['return'];
                } else {
                    throw e;
                }
            }
            return ret;
        }
        this[ key ].__defineGetter__( 'asString', function() {
            return orig.asString + 'ʹ';
        } );
    }

    this.deref = function( id, regex ) {
        regex = regex || new RegExp( '^([^\.]+)\.' );
        return get( id, regex )
    }

    function get( id, regex ) {
        if( regex ) {
            var path = new MutableString( id );
            var step = get( path.chomp( regex ) );
            if( step && step.get ) {
                return step.get( path, regex );
            }
        }

        var ptr;
        if( typeof id == 'number' ) {
            if( id > 0 ) {
                id = id - 1      // index to offset
            } else if( id < 0 ) {
                id += this.count // end-based index
            }
            ptr = new MapPointer( itms, keys[ id ] );
        } else if( typeof id == 'string' ||
                   id instanceof String ) {
            ptr = itms[ id ];
        }

        var itm = ptr !== undefined ? ptr.val : undefined 
        return itm
    }
    this.get = get

    function set( key, itm ) {
        var self = arguments.callee;
        if( typeof silent != 'undefined' && ! silent && typeof console != 'undefined' ) {
            console.log( self.asString + ':' + key + ':' + itm );
        }
        var uid = this.add( itm, key );
        if( typeof silent != 'undefined' && ! silent && typeof console != 'undefined' ) {
            console.log( self.asString
                         + ':' + key + ':' + itm
                         + '=' + uid + ':' + ( this.get
                                               ? this.get( uid )
                                               : '¬get'
                                             )
                       )
        }
        return this;
    }
    this.set = set;
    this.set.__defineGetter__( 'asString', function() { return 'θ:⒧:↧'; } );
    
    this.let = function( key, itm ) {
        if( this.get( key ) === undefined ) {
            this.set( key, itm );
        }
    }

    this.__defineGetter__( 'count', function() {
        return keys.length;
    } );

    this.__defineGetter__( 'vals', function() {
        var vals = []
        this.each( function( val, key ) {
            vals.push( val )
        } )
        return vals
    } );

    // true if each relationship and value in a is in b
    function isSubobjectOf( a, b ) {
        var found = true;
        if( typeof a == 'undefined' && typeof b == 'undefined' ) {
            // nothing matches itself
        } else if( typeof a == 'object' && typeof b == 'object' ) {
            for( var prop in a ) {
                found = found && isSubobjectOf( a[ prop ],
                                                b[ prop ] );
                if( ! found ) break;
            }
        } else if( typeof a == 'function' && typeof b == 'function' ) {
            // functions always match
        } else {
            found = found && a == b;
        }
        return found;
    }

    this.id = function( key ) {
        try {
            this.each( function( obj, id ) {
                if( typeof silent != 'undefined' && ! silent && typeof console != 'undefined' ) {
                    console.log( 'θ:⒧:⊆:⇄' + id );
                }
                if( isSubobjectOf( key, obj ) ) {
                    throw id;
                }
            } );
        } catch( e ) {
            if( typeof silent != 'undefined' && ! silent && typeof console != 'undefined' ) {
                console.log( 'θ:⒧:⊆:e:⇄:' + e );
            }
            return e;
        }
        return undefined;
    }

    this.trans = function( func ) {
        var next = {};
        this.each( function() {
            func.apply( next, arguments )
        } );
        return next;
    }

    this.map = function( func, type ) {
        type = type || 'straight';
        return this.map[ type ].apply( this, arguments );
    }

    this.map.straight = function( func ) {
        var out = new List();
        this.each( function( val, key ) {
            out.set( key, func.apply( this, [ val, key ] ) )
        } );
        return out;
    }

    this.map.tangle = function( func ) {
        var out = new List();
        this.each( function( val, key ) {
            if( typeof val == 'function' ) {
                out.set( key, val );
            } else {
                out.set( key, func.apply( this, [ val, key ] ) )
            }
        } );
        return out;
    }

    // ToDo:
    this.map.mirror = function( func ) {
        var out = new List();
        var self = this;
        this.each( function( val, key ) {
            var get = self.__lookupGetter__( key );
            var set = self.__lookupSetter__( key );
            if( get && set ) {
                out.__defineGetter__( get );
                out.__defineSetter__( set );
            } else {
                out.set( key, func.apply( self, [ val, key ] ) )
            }
        } );
        return out;
    }

    this.div = function( num ) {
        return this.map( function( val ) {
            return typeof val == 'number' && val / num || val
        }, 'mirror' )
    }

    this.__defineGetter__( 'clone', function() {
        return new List( this );
    } );

    this.__defineGetter__( 'asMap', function() {
        var map = {};
        this.each( function( itm, key ) {
            map[key] = itm;
        } );
        return map;
    } );

    this.__defineSetter__( 'top', function( itm ) {
        this.add( itm )
    } );

    this.__defineGetter__( 'top', function() {
        return this.get( -1 )
    } );

    this.__defineGetter__( 'pop', function( ) {
        var out = this.get( keys.pop() );
        return out;
    } );

    this.each = function( f ) {
        keys.each( function( key, idx ) {
            if( key !== undefined ) {
                f.apply( this, [ get( key ), key ] )
            }
        } );
    }

    this.__defineGetter__( 'asString', function() {
        try {
            return 'List'; //JSON.stringify( itmLst )
        } catch(e) {
            console.log( '!:θ:⒧:asString:' )
        }
    } );

    this.toString = function() {
        return this.asString
    }

    // Checks if a variable with
    // the given name is defined
    function exists( variable ) {
        var key = new MutableString( variable );
        var baseId = key['.'];
        eval( 'var val = ' + baseId );
        console.log( 'p:' + baseId + val );
        while( val && ( prop = key['.'] ) ) {
            val = val[ prop ];
        }
        return key.empty && val !== undefined;
    }

    function traverse( f, depth, index ) {
        depth = depth || 1;
        index = index || 1;
        f( self, { depth: depth, index: index } );
        var subindex = 0;
        this.each( function( item, key ) {
            if( item instanceof List ) {
                item.traverse( f, depth + 1, ++subindex )
            }
        } );
    }
    this.traverse = traverse;

    for( prop in this ) {
        builtin[ prop ] = true;
    }
}
List.prototype = new Array

NamedNodeMap.prototype.each = function( f ) {
    Array.prototype.each.apply( this, [ function( attr, idx ) {
        f.apply( attr, [ attr.nodeValue, attr.name ] )
    } ] )
}
