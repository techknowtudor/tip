function Pointer() {
    this.val = null
}
Pointer.Accessor = function( store, get, set ) {
    this.__defineGetter__( 'selfʻ', function() {
        return get.apply( store, arguments )
    } )
    this.__defineSetter__( 'selfʻ', function() {
        return set.apply( store, arguments )
    } )
}
Pointer.Slot = function( val ) {
    this.__defineGetter__( 'selfʻ', function() {
        return val
    } )
    this.__defineSetter__( 'selfʻ', function( valʻ ) {
        return val = valʻ
    } )
}

function List( init ) {
    var keys = []
    var store = {}
    var listeners = {}
    var self = this

    function get( key ) {
        return store[ key ].selfʻ
    }
    self.get = get

    function set( key, val ) {
        var ptr = store[ key ]
        listeners.set = listeners.set || {}
        return trigger( listeners.set, [ val, ptr ], function( val, ptr ) {
            return ptr.selfʻ = val
        } )
    }
    self.set = set

    function add( val, key ) {
        var ptr = ( val instanceof Pointer
                    ? val
                    : new Pointer.Slot( val ) )
        if( key === undefined ) { // Push
            key = keys.length
            if( store[ key ] !== undefined ) throw 'Autogenerated key collision: ' + key
        }
        if( store[ key ] === undefined ) { // New key
            keys.push( key )
            self.__defineGetter__( key, function() { return self.get( key ) } )
            self.__defineSetter__( key, function( val ) { return self.set( key, val ) } )

            on.set[ key ] = {
                add : function( f ) {
                    listeners.set = listeners.set || {}
                    listeners.set[ key ] = listeners.set[ key ] || []
                    return listeners.set[ key ].push( f )
                },
                remove : function( f ) {
                    throw 'Not implemented'
                },
            }
        }
        return store[ key ] = ptr
    }
    self.add = add

    function vals() {
        var vals = []
        each( function( val, key ) {
            vals.push( val )
        } )
        return vals
    }
    self.vals = vals

    function join( sep ) {
        return vals().join( sep )
    }
    self.join = join

    function each( f ) {
        var ʻself = this || self
        keys.each( function( key ) {
            f.apply( ʻself, [ self.get( key ), key ] )
        } )
    }
    self.each = each

    var on = {
        set : {}
    }
    self.__defineGetter__( 'on', function() { return on } )

    self.__defineGetter__( 'length', function() { return store.length } )

    function trigger( listeners, args, action ) {
        var self = this
        listeners = as.List( listeners )
        listeners.each( function( f ) {
            if( typeof f.pre == 'function' ) {
                f.pre.apply( self, args )
            }
        } )
        action.apply( self, args )
        listeners.each( function( f ) {
            if( typeof f == 'function' ) {
                f.apply( self, args )
            }
        } )
        listeners.each( function( f ) {
            if( typeof f.post == 'function' ) {
                f.post.apply( self, args )
            }
        } )
    }

    for( prop in init ) {
        if( init.hasOwnProperty( prop ) ) {
            ( function() {
                var id = ( init instanceof Array
                           && ( prop instanceof Number || typeof prop == 'number'
                                || ( typeof prop == 'string' && /^[0-9]+$/.test( prop ) ) )
                           ? parseInt( prop ) + 1 // Indexed from 1
                           : prop )
                var val = ( function() {
                    var get = init.__lookupGetter__( prop )
                    var set = init.__lookupSetter__( prop )
                    return ( ( get || set )
                             ? new Pointer.Accessor( init, get, set )
                             : init[ prop ] )
                } )()
                add( val, id )
            } ).apply( this )
        }
    }
}

List.by = {
    ids : function( ids ) {
        var list = new List
        ids.each( function( id ) {
            list.add( null, id )
        } )
        return list
    },
}

var as = as || {}
as.List = as.List || function() {
    var val = ( arguments.length == 0
                ? undefined
                : ( arguments.length == 1
                    ? arguments[ 0 ]
                    : Array.prototype.slice.call( arguments ) ) )
    if( val instanceof List ) return val
    if ( val === undefined || val === null || val === true || val === false )
        return val
    val = ( val instanceof Number || val instanceof String ) ? [ val ] : val
    if( val instanceof Array || val instanceof Object )
        return new List( val )
    throw "Wha' Happen?"
}

List.invert = function() {
    var val = as.List( arguments.length == 0
                       ? undefined
                       : ( arguments.length == 1
                           ? arguments[ 0 ]
                           : Array.prototype.slice.call( arguments ) ) )
    var out = new List
    val.each( function( val, id ) { out.add( id, val ) } )
    return out
}

List.__defineGetter__( 'inverse', function() { return List.invert.call( this, this ) } )