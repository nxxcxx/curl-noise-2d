/* exported run */

function update() {

	//@ifdef VECTOR_FIELD
		fbos.tUniforms.time.value = clock.getElapsedTime();
		fbos.simulate();
		gridShader.uniforms.heightMap.value = fbos.getOutput();
	//@endif

	//@ifdef PARTICLE_FIELD
		fbor.getPass( 'velocity' ).uniforms.time.value = clock.getElapsedTime();

		fbor.tick();

		psys.setPositionBuffer( fbor.getPass( 'position' ).getRenderTarget() );
		psys.material.uniforms.velocityBuffer.value = fbor.getPass( 'velocity' ).getRenderTarget();
	//@endif

}


// ----  draw loop
function run() {

	requestAnimationFrame( run );
	renderer.clear();
	update();
	renderer.render( scene, camera );

	//@ifdef VECTOR_FIELD
		fbos.renderHUD();
	//@endif

	//@ifdef PARTICLE_FIELD
		hud.setInputTexture( fbor.getPass( 'velocity' ).getRenderTarget() );
		hud.render();
	//@endif

	stats.update();

}
