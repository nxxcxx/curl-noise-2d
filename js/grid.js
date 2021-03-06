/* exported grid */

function grid( _size, _segment ) {

	gridGeom = new THREE.BufferGeometry();
	var size = _size;
	var segment = _segment;
	var initialHeight = 0;
	var hs = size * 0.5;
	var spc = size / segment;

	var i, r, c;
	// arrange vertices like a grid
	var vertexPositions = [];
	for ( r = 0; r <= segment; r++ ) {
		for ( c = 0; c <= segment; c++ ) {

			vertexPositions.push( [ -hs + spc * c, -hs + spc * r, 0 ] );
			vertexPositions.push( [ -hs + spc * c, -hs + spc * r, initialHeight ] );

		}
	}

	// transfer to typed array
	var buffVerts = new Float32Array( vertexPositions.length * 3 );
	for ( i = 0; i < vertexPositions.length; i++ ) {

		buffVerts[ i * 3 + 0 ] = vertexPositions[ i ][ 0 ];
		buffVerts[ i * 3 + 1 ] = vertexPositions[ i ][ 1 ];
		buffVerts[ i * 3 + 2 ] = vertexPositions[ i ][ 2 ];

	}

	/* store reference position when sampling a texel in a shader
	 *  UV       (1,1)
	 *	  ┌─────────┐
	 *	  │       / │
	 *	  │     /   │
	 *	  │   /     │
	 *	  │ /       │
	 *	  └─────────┘
	 * (0,0)
	 */

	var vertexHere = [];
	var normalizedSpacing = 1.0 / segment;
	for ( r = 0; r <= segment; r++ ) {
		for ( c = 0; c <= segment; c++ ) {

			vertexHere.push( [ normalizedSpacing * c, normalizedSpacing * r, 0 ] );
			vertexHere.push( [ normalizedSpacing * c, normalizedSpacing * r, 1.0 ] ); // flag a vertex to displace in a shader

		}
	}

	// transfer to typed array
	var buffHere = new Float32Array( vertexHere.length * 3 );

	for ( i = 0; i < vertexHere.length; i++ ) {

		buffHere[ i * 3 + 0 ] = vertexHere[ i ][ 0 ];
		buffHere[ i * 3 + 1 ] = vertexHere[ i ][ 1 ];
		buffHere[ i * 3 + 2 ] = vertexHere[ i ][ 2 ];

	}



	// vertex color
	var vcolor = [];
	for ( r = 0; r <= segment; r++ ) {
		for ( c = 0; c <= segment; c++ ) {

			vcolor.push( [ 1.0, 0.0, 0.0 ] );
			vcolor.push( [ 0.0, 0.0, 1.0 ] );
		}
	}

	var buffColor = new Float32Array( vcolor.length * 3 );

	for ( i = 0; i < vcolor.length; i++ ) {

		buffColor[ i * 3 + 0 ] = vcolor[ i ][ 0 ];
		buffColor[ i * 3 + 1 ] = vcolor[ i ][ 1 ];
		buffColor[ i * 3 + 2 ] = vcolor[ i ][ 2 ];

	}


	gridGeom.addAttribute( 'position', new THREE.BufferAttribute( buffVerts, 3 ) );
	gridGeom.addAttribute( 'here', new THREE.BufferAttribute( buffHere, 3 ) );
	gridGeom.addAttribute( 'color', new THREE.BufferAttribute( buffColor, 3 ) );

	gridGeom.attributes.position.needsUpdate = true;
	gridGeom.attributes.here.needsUpdate = true;
	gridGeom.attributes.color.needsUpdate = true;


	gridShader = new THREE.ShaderMaterial( {

		uniforms: {
			heightMap: {
				type: 't',
				value: null
			},
		},

		attributes: {
			here: {
				type: 'v3',
				value: null
			} // need to specify attributes .addAttribute won't add in here
		},

		vertexShader: SHADER_CONTAINER.vectorFieldVert,
		fragmentShader: SHADER_CONTAINER.vectorFieldFrag,
		// transparent: true,
		// blending: THREE.AdditiveBlending,
		// depthWrite: false
		// depthTest: false,
		// side: THREE.DoubleSide,

	} );

	gridMesh = new THREE.Line( gridGeom, gridShader, THREE.LinePieces );

	scene.add( gridMesh );

}
