/**
 * @author mrdoob / http://mrdoob.com/
 * @author alteredq / http://alteredqualia.com/
 * @author paulirish / http://paulirish.com/
 */

 
 	// context menu start
	
	/**
	* Variables.
	*/
	var taskItemClassName = 'task';
	var menu = document.querySelector("#context-menu");
	var menuState = 0;
	var activeClassName = "context-menu--active";
	
	var active = "context-menu--active";
	function toggleMenuOn() {
		// var menu = document.querySelector("#context-menu");
		var menu = document.getElementById("context-menu");
		if ( menuState !== 1 ) {
			menuState = 1;
			menu.classList.add(active);
		}
	}
	function toggleMenuOff() {
		var menu = document.getElementById("context-menu");
		if ( menuState !== 0 ) {
			menuState = 0;
			menu.classList.remove(activeClassName);
		}
	}
	function menuItemListener( link ) {
		//console.log( "Task ID - " + 
		//	taskItemInContext.getAttribute("data-id") + 
		//	", Task action - " + link.getAttribute("data-action"));
		toggleMenuOff();
	}
	
	function clickInsideElement( e, className ) {
	  var el = e.srcElement || e.target;

	  if ( el.classList.contains(className) ) {
		return el;
	  } else {
		while ( el = el.parentNode ) {
		  if ( el.classList && el.classList.contains(className) ) {
			return el;
		  }
		}
	  }

	  return false;
	}
	
	function clickListener() {
		document.addEventListener( "click", function(e) {
			var clickeElIsLink = clickInsideElement( e, contextMenuLinkClassName );

			if ( clickeElIsLink ) {
				e.preventDefault();
				menuItemListener( clickeElIsLink );
			} else {
				var button = e.which || e.button;
				if ( button === 1 ) {
					toggleMenuOff();
				}
			}
		});
	}
	function contextListener() {
	  document.addEventListener( "contextmenu", function(e) {
		taskItemInContext = clickInsideElement( e, taskItemClassName );

		if ( taskItemInContext ) {
		  e.preventDefault();
		  toggleMenuOn();
		  positionMenu(e);
		} else {
		  taskItemInContext = null;
		  toggleMenuOff();
		}
	  });
	}
	
	function contextmenu( event ) {
		event.preventDefault();
		console.log(event);
		if( menuState==0){
			toggleMenuOn();
		} else {
			toggleMenuOff();
		}
	}
	var taskItemInContext;
	var contextMenuLinkClassName = "context-menu__link";
	contextListener();
	clickListener();
	// context menu stop

 
//THREE.FirstPersonControls = function ( object, domElement ) {
THREE.FirstPersonControls = function ( object, meshList, domElement ) {
//THREE.FirstPersonControls = function ( object ) {

	//domElement = undefined;
	this.object = object;
	this.target = new THREE.Vector3( 0, 0, 0 );
	this.targetPosition = null;
	this.objects = meshList;

	this.domElement = ( domElement !== undefined ) ? domElement : document;

	this.enabled = true;

	this.raycaster = new THREE.Raycaster();
	this.displayObjectInfo = false
	
	//this.movementSpeed = 1.0;
	this.movementSpeed = 1000.0;
	// this.lookSpeed = 0.005;
	this.lookSpeed = 0.05;

	this.lookVertical = true;
	this.autoForward = false;

	this.activeLook = true;

	this.heightSpeed = false;
	this.heightCoef = 1.0;
	this.heightMin = 0.0;
	this.heightMax = 1.0;

	this.constrainVertical = false;
	this.verticalMin = 0;
	this.verticalMax = Math.PI;

	this.autoSpeedFactor = 0.0;

	this.mouseX = 0;
	this.mouseY = 0;

	this.lat = 0;
	this.lon = 0;
	this.phi = 0;
	this.theta = 0;

	this.moveForward = false;
	this.moveBackward = false;
	this.moveLeft = false;
	this.moveRight = false;

    this.turnUp = false;
    this.turnLeft = false;
    this.turnRight = false;
    this.turnDown = false;

	

	this.mouseDragOn = false;

	this.viewHalfX = 0;
	this.viewHalfY = 0;

	if ( this.domElement !== document ) {

		this.domElement.setAttribute( 'tabindex', - 1 );

	}

	//

	this.handleResize = function () {

		if ( this.domElement === document ) {

			this.viewHalfX = window.innerWidth / 2;
			this.viewHalfY = window.innerHeight / 2;

		} else {

			this.viewHalfX = this.domElement.offsetWidth / 2;
			this.viewHalfY = this.domElement.offsetHeight / 2;

		}

	};
	//*
	this.addCube = function(position)
	{
		// var geo = new THREE.BoxGeometry( 10, 10, 10 );
		var geo = new THREE.BoxGeometry( 5, 5, 5 );
		var mat = new THREE.MeshLambertMaterial( { color: 0xFF0000 } ); 
		var box = new THREE.Mesh(geo, mat);
		box.position.copy(position);
		
		gscene.add(box);
		//render();
	}
	
	this.clickPositionGuess = function( distance, direction )
	{
		
		var targetDirVector = new THREE.Vector3(0,0,0);
		var camPos 			= new THREE.Vector3(0,0,0);
		targetDirVector.copy( this.targetPosition);
		camPos.copy(this.object.position);
		// console.log("tdv:");
		// console.log(targetDirVector);
		// var unitDirVector = targetDirVector.divideScalar(this.targetPosition.length());		
		var unitDirVector = direction;
		// console.log("udv");
		// console.log(unitDirVector);
		var clickPosition = camPos.add(unitDirVector.multiplyScalar(distance));
		
		// console.log(targetDirVector);
		// console.log(targetDirVector.length());
		// console.log(unitDirVector);
		
		console.log("cam:");
		console.log(this.object.position);
		console.log("clic pos:");
		console.log(clickPosition);
		// alert(clickPosition.x +",  " + clickPosition.y +",  " + clickPosition.z);
		this.addCube(clickPosition);
		//this.addCube(this.object.position);
	}
	
	this.rayCastGet = function( event )
	{
		
		var mouse = new THREE.Vector2();
		mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
		mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
		this.raycaster.setFromCamera( mouse, this.object );
	

		
		var intersects = this.raycaster.intersectObjects( this.objects );
		
		if ( intersects.length > 0 ) {

			SELECTED = intersects[ 0 ].object;
			console.log(intersects[ 0 ].distance);
			console.log(SELECTED.geometry.name + ":" + SELECTED.geometry.uuid + ":" + SELECTED.name);
			this.clickPositionGuess(intersects[ 0 ].distance, this.raycaster.ray.direction);
		}
	}
//*/
	this.onMouseDown = function ( event ) {

		if ( this.domElement !== document ) {

			this.domElement.focus();

		}

		event.preventDefault();
		event.stopPropagation();

		
		if ( this.activeLook ) {

			switch ( event.button ) {
				case 0: this.rayCastGet(event); break;
				//case 0: this.displayObjectInfo = true; break;
/*
				case 0: this.moveForward = true; break;
				case 2: this.moveBackward = true; break;
	//*/
			}

		}

		this.mouseDragOn = true;

	};

	this.onMouseUp = function ( event ) {

		event.preventDefault();
		event.stopPropagation();

		/*
		if ( this.activeLook ) {

			switch ( event.button ) {

				case 0: this.moveForward = false; break;
				case 2: this.moveBackward = false; break;

			}

		}
		
		this.mouseDragOn = false;
		//*/
	};

	this.onMouseMove = function ( event ) {

		if ( this.domElement === document ) {

			this.mouseX = event.pageX - this.viewHalfX;
			this.mouseY = event.pageY - this.viewHalfY;

		} else {

			this.mouseX = event.pageX - this.domElement.offsetLeft - this.viewHalfX;
			this.mouseY = event.pageY - this.domElement.offsetTop - this.viewHalfY;

		}

	};

	this.onKeyDown = function ( event ) {

		isShift = !!window.event.shiftKey; // typecast to boolean
		//event.preventDefault();
	    console.log(event.keyCode);
		if(!isShift){
			switch ( event.keyCode ) {
				case 38: /*up*/
				case 87: /*W*/ this.moveForward = true; break;

				case 37: /*left*/
				case 65: /*A*/ this.moveLeft = true; break;

				case 40: /*down*/
				case 83: /*S*/ this.moveBackward = true; break;

				case 39: /*right*/
				case 68: /*D*/ this.moveRight = true; break;

				case 82: /*R*/ this.moveUp = true; break;
				case 70: /*F*/ this.moveDown = true; break;

				case 104: /*numpad 8*/ this.turnUp = true; break;
				case 100: /*numpad 4*/ this.turnLeft = true; break;
				case 102: /*numpad 6*/ this.turnRight = true; break;
				case 98:  /*numpad 2*/ this.turnDown = true; break;
				
				case 84:  /*T*/ toggleTransparency();
			}
		} else {
			switch ( event.keyCode ) {
				case 38: /*up*/
				case 87: /*W*/ {this.turnUp = true; break;}
				case 37: /*left*/
				case 65: /*A*/ this.turnLeft = true; break;
				case 40: /*down*/
				case 83: /*S*/ this.turnDown = true; break;
				case 39: /*right*/
				case 68: /*D*/ this.turnRight = true; break;
			}
		}
	};

	this.onKeyUp = function ( event ) {

		isShift = !!window.event.shiftKey; // typecast to boolean	
		if(!isShift){
			switch ( event.keyCode ) {

				case 38: /*up*/
				case 87: /*W*/ 
					if(!isShift){this.moveForward = false; break;}
							else{this.turnUp = false; break;}

				case 37: /*left*/
				case 65: /*A*/ this.moveLeft = false; break;

				case 40: /*down*/
				case 83: /*S*/ this.moveBackward = false; break;

				case 39: /*right*/
				case 68: /*D*/ this.moveRight = false; break;

				case 82: /*R*/ this.moveUp = false; break;
				case 70: /*F*/ this.moveDown = false; break;

				case 104: /*numpad 8*/ this.turnUp = false; break;
				case 100: /*numpad 4*/ this.turnLeft = false; break;
				case 102: /*numpad 6*/ this.turnRight = false; break;
				case 98:  /*numpad 2*/ this.turnDown = false; break;
			}
		} else {
			switch ( event.keyCode ) {
				case 38: /*up*/
				case 87: /*W*/ {this.turnUp = false; break;}
				case 37: /*left*/
				case 65: /*A*/ this.turnLeft = false; break;
				case 40: /*down*/
				case 83: /*S*/ this.turnDown = false; break;
				case 39: /*right*/
				case 68: /*D*/ this.turnRight = false; break;
			}
		}
	};

	this.update = function( delta ) {

		if ( this.enabled === false ) return;

		if ( this.heightSpeed ) {

			var y = THREE.Math.clamp( this.object.position.y, this.heightMin, this.heightMax );
			var heightDelta = y - this.heightMin;

			this.autoSpeedFactor = delta * ( heightDelta * this.heightCoef );

		} else {

			this.autoSpeedFactor = 0.0;

		}

		var actualMoveSpeed = delta * this.movementSpeed;

		if ( this.moveForward || ( this.autoForward && ! this.moveBackward ) ) this.object.translateZ( - ( actualMoveSpeed + this.autoSpeedFactor ) );
		if ( this.moveBackward ) this.object.translateZ( actualMoveSpeed );

		if ( this.moveLeft ) this.object.translateX( - actualMoveSpeed );
		if ( this.moveRight ) this.object.translateX( actualMoveSpeed );

		if ( this.moveUp ) this.object.translateY( actualMoveSpeed );
		if ( this.moveDown ) this.object.translateY( - actualMoveSpeed );

		var actualLookSpeed = delta * this.lookSpeed;

		if ( ! this.activeLook ) {

			actualLookSpeed = 0;

		}

		var verticalLookRatio = 1;

		if ( this.constrainVertical ) {

			verticalLookRatio = Math.PI / ( this.verticalMax - this.verticalMin );

		}
		var factor = 700;
		if (this.turnUp) { this.lat += factor * actualLookSpeed; }
		if (this.turnDown) { this.lat -= factor * actualLookSpeed; }
		if (this.turnLeft) { this.lon -= factor * actualLookSpeed; }
		if (this.turnRight) { this.lon += factor * actualLookSpeed; }


		//this.lon += this.mouseX * actualLookSpeed;
		////console.log(this.mouseX);
		//if ( this.lookVertical ) this.lat -= this.mouseY * actualLookSpeed * verticalLookRatio;

		this.lat = Math.max( - 85, Math.min( 85, this.lat ) );
		this.phi = THREE.Math.degToRad( 90 - this.lat );

		this.theta = THREE.Math.degToRad( this.lon );

		if ( this.constrainVertical ) {

			this.phi = THREE.Math.mapLinear( this.phi, 0, Math.PI, this.verticalMin, this.verticalMax );

		}

		//var targetPosition = this.target,
		this.targetPosition = this.target,
			position = this.object.position;

		this.targetPosition.x = position.x + 10 * Math.sin( this.phi ) * Math.cos( this.theta );
		this.targetPosition.y = position.y + 10 * Math.cos( this.phi );
		this.targetPosition.z = position.z + 10 * Math.sin( this.phi ) * Math.sin( this.theta );

		this.object.lookAt( this.targetPosition );

	};

	
	this.dispose = function() {

		this.domElement.removeEventListener( 'contextmenu', contextmenu, false );
		this.domElement.removeEventListener( 'mousedown', _onMouseDown, false );
		this.domElement.removeEventListener( 'mousemove', _onMouseMove, false );
		this.domElement.removeEventListener( 'mouseup', _onMouseUp, false );

		window.removeEventListener( 'keydown', _onKeyDown, false );
		window.removeEventListener( 'keyup', _onKeyUp, false );

	}

	var _onMouseMove = bind( this, this.onMouseMove );
	var _onMouseDown = bind( this, this.onMouseDown );
	var _onMouseUp = bind( this, this.onMouseUp );
	var _onKeyDown = bind( this, this.onKeyDown );
	var _onKeyUp = bind( this, this.onKeyUp );

	this.domElement.addEventListener( 'contextmenu', contextmenu, false );
	this.domElement.addEventListener( 'mousemove', _onMouseMove, false );
	this.domElement.addEventListener( 'mousedown', _onMouseDown, false );
	this.domElement.addEventListener( 'mouseup', _onMouseUp, false );

	window.addEventListener( 'keydown', _onKeyDown, false );
	window.addEventListener( 'keyup', _onKeyUp, false );

	function bind( scope, fn ) {

		return function () {

			fn.apply( scope, arguments );

		};

	}

	this.handleResize();

};
