/**
 * @author mrdoob / http://mrdoob.com
 * @modified by obviousjim & kkukshtel / simile
 * @modified by BCatDC / for Aframe.io
 *
 * Original at https://github.com/SimileSystems/DepthKitJS

 */

( function () {

	var precision      = 1;
	var linesGeometry  = new THREE.Geometry();
	var pointsGeometry = new THREE.Geometry();

	RGBDVideo = function ( properties ) {

		var video          = document.createElement( 'video' );
		 video.loop = true;
		 video.id = properties.name;

		var depthWidth   = properties.depthImageSizeX;
		var depthHeight  = properties.depthImageSizeY;
		var isPlaying    = false;
		var imageTexture = THREE.TextureLoader( 'depthkit/files/' + properties.name + '.png' );
		var videoTexture = new THREE.Texture( video );

		for ( var y = 0; y < depthHeight; y += precision ) {
			for ( var x = 0, x2 = precision; x < depthWidth; x += precision, x2 += precision ) {

				linesGeometry.vertices.push( new THREE.Vector3( x, y, 0 ) );
				linesGeometry.vertices.push( new THREE.Vector3( x2, y, 0 ) );
			}
		}


		for ( var y = 0; y < depthHeight; y += precision ) {
			for ( var x = 0; x < depthWidth; x += precision ) {
				pointsGeometry.vertices.push( new THREE.Vector3( x, y, 0 ) );
			}
		}

		THREE.Object3D.call( this );

		videoTexture.minFilter = THREE.LinearFilter;
		videoTexture.magFilter = THREE.LinearFilter;
		videoTexture.format = THREE.RGBFormat;
		videoTexture.generateMipmaps = false;

		var linesMaterial = new THREE.ShaderMaterial( {

			uniforms: {
				"map":         { type: "t", value: imageTexture },
				"opacity":     { type: "f", value: 0.3 },
				"mindepth":    { type: "f", value: properties.nearClip },
				"maxdepth":    { type: "f", value: properties.farClip },
				"imageWidth":  { type: "f", value: properties.depthImageSizeX },
				"imageHeight": { type: "f", value: properties.depthImageSizeY },
				"focalX":      { type: "f", value: properties.depthFocalLengthX },
				"focalY":      { type: "f", value: properties.depthFocalLengthY },
				"principleX":  { type: "f", value: properties.depthPrincipalPointX },
				"principleY":  { type: "f", value: properties.depthPrincipalPointY }
			},

			vertexShader:   document.getElementById( 'vs' ).textContent,
			fragmentShader: document.getElementById( 'fs' ).textContent,
			//blending:       THREE.AdditiveBlending,
			blending:       THREE.NoBlending,
			depthTest:      true,
			depthWrite:     true,
			wireframe: false,
			transparent:    false

		} );

		linesMaterial.linewidth = 1;

		this.lines = new THREE.Line( linesGeometry, linesMaterial, THREE.LineSegments ) ;

		//ROTATE 90° (In Radians) because this DepthKit clip was recorded in Portrait Format
		//this.lines.rotation.z = -1.5708;


		//this.add( this.lines );

		var pointsMaterial = new THREE.ShaderMaterial( {

			uniforms: {

				"map":         { type: "t", value: imageTexture },
				"opacity":     { type: "f", value: 0.99 },
				"mindepth":    { type: "f", value: properties.nearClip },
				"maxdepth":    { type: "f", value: properties.farClip },
				"imageWidth":  { type: "f", value: properties.depthImageSizeX },
				"imageHeight": { type: "f", value: properties.depthImageSizeY },
				"focalX":      { type: "f", value: properties.depthFocalLengthX },
				"focalY":      { type: "f", value: properties.depthFocalLengthY },
				"principleX":  { type: "f", value: properties.depthPrincipalPointX },
				"principleY":  { type: "f", value: properties.depthPrincipalPointY}
			},

			vertexShader:   document.getElementById( 'vs' ).textContent,
			fragmentShader: document.getElementById( 'fs' ).textContent,
			//blending:       THREE.AdditiveBlending,
			blending:       THREE.NoBlending,
			depthTest:      true,
			depthWrite:     true,
			transparent:    false

		} );
		this.particles = new THREE.Points( pointsGeometry, pointsMaterial );

	//ROTATE 90° (In Radians) because this DepthKit clip was recorded in Portrait Format
		//this.particles.rotation.z = -1.5708;

		this.add( this.particles );


		// public
		this.play = function () {

			if ( isPlaying === true ) return;

			linesMaterial.uniforms.opacity.value  = 1;
			pointsMaterial.uniforms.opacity.value = 1;

			video.src = 'rgbd_files/' + properties.name + '.webm';

			video.play();

			interval = setInterval( function () {

				if ( video.readyState === video.HAVE_ENOUGH_DATA ) {

					linesMaterial.uniforms.map.value = videoTexture;
					pointsMaterial.uniforms.map.value = videoTexture;
					videoTexture.needsUpdate = true;
				}

			 }, 1000 / 25 );

			isPlaying = true;

		};

		this.pause = function () {

			if ( isPlaying === false ) return;

			linesMaterial.uniforms.opacity.value = 0.0;
			pointsMaterial.uniforms.opacity.value = 0.0;

			video.pause();

			clearInterval( interval );

			isPlaying = false;

		};

		this.isPlaying = function () {

			return isPlaying;

		};

	};

	RGBDVideo.prototype = Object.create( THREE.Object3D.prototype );

} )();


/**
 * Simple Component Registry
 */ 

    AFRAME.registerComponent('rgbd-video', {
      schema: {
        name: {type: 'string', default: 'video'},

        depthFocalLengthX: {type: 'number', default: 365.2185974121094},
        depthFocalLengthY: {type: 'number', default: 365.2185974121094},

        depthImageSizeX: {type: 'number', default: 512},
        depthImageSizeY: {type: 'number', default: 424},

        depthPrincipalPointX: {type: 'number', default: 257.6430969238281},
        depthPrincipalPointY: {type: 'number', default: 209.3957977294922},

        farClip: {type: 'number', default: 1204.192016601562},
        nearClip: {type: 'number', default: 434.166748046875}
      },

      update: function() {
      //  var el = document.querySelector('#my-volumetric-video');
        var video = new RGBDVideo(this.data);
        this.el.setObject3D('mesh', video);
	      video.play();
      },

    });