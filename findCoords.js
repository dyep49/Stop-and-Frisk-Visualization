function findCoords(x,y) {
	// This function converts coordinates from Washington State Plane South Zone NAD27 feet
	// to Geographic coordinates in decimal degrees
	//
	// The formula this program is based on are from "Map Projections,
	// A Working Manual" by John P. Snyder, U.S. Geological Survey
	// Professional Paper 1395, 1987, pages 295-298
	//
	// Set up the coordinate system parameters.
	var A = 20925874.015664328;     // major radius of Clarke 1866 ellipsoid, feet
	var Ec = 0.0822719;             // eccentricity of Clarke 1866 ellipsoid
	var Ec2 = Ec * Ec;              // eccentricity squared
	var AngRad = 0.01745329252;     // number of radians in a degree
	var Pi4 = 3.141592653582 / 4;   // Pi / 4
	var P1 = 41.033333 * AngRad;    // latitude of first standard parallel
	var P2 = 40.166666 * AngRad;    // latitude of second standard parallel
	var P0 = 40.166666 * AngRad;    // latitude of origin
	var M0 = -74 * AngRad;          // central meridian
	var X0 = 984250.0000000002;     // False easting of central meridian, map units

	// Calculate the coordinate system constants.
	var m1 = Math.cos(P1) / Math.sqrt(1 - (Ec2 * Math.pow((Math.sin(P1)),2)));
	var m2 = Math.cos(P2) / Math.sqrt(1 - (Ec2 * Math.pow((Math.sin(P2)),2)));
	var t1 = Math.tan(Pi4 - (P1 / 2)) / Math.pow((1 - Ec * Math.sin(P1)) / (1 + Ec * Math.sin(P1)),(Ec/2));
	var t2 = Math.tan(Pi4 - (P2 / 2)) / Math.pow((1 - Ec * Math.sin(P2)) / (1 + Ec * Math.sin(P2)),(Ec/2));
	var t0 = Math.tan(Pi4 - (P0 / 2)) / Math.pow((1 - Ec * Math.sin(P0)) / (1 + Ec * Math.sin(P0)),(Ec/2));
	var n = Math.log(m1 / m2) / Math.log(t1 / t2);
	var F = m1 / (n * Math.pow(t1,n));
	var rho0 = A * F * Math.pow(t0,n);
	// Convert the coordinate to Latitude/Longitude.

	// Calculate the Longitude.
	x = x - X0;
	var Pi2 = Pi4 * 2;
	var rho = Math.sqrt(Math.pow(x,2) + (Math.pow(rho0 - y,2)));
	var theta = Math.atan(x/(rho0 - y));
	var t = Math.pow(rho / (A * F),(1 / n));
	var LonR = theta / n + M0;
	x = x + X0;

	// Estimate the Latitude
	var Lat0 = Pi2 - (2 * Math.atan(t));

	// Substitute the estimate into the iterative calculation that
	// converges on the correct Latitude value.
	var part1 = (1 - (Ec * Math.sin(Lat0))) / (1 + (Ec * Math.sin(Lat0)));
	var LatR = Pi2 - (2 * Math.atan(t * Math.pow(part1,(Ec/2))));
	do {
		Lat0 = LatR;
		part1 = (1 - (Ec * Math.sin(Lat0))) / (1 + (Ec * Math.sin(Lat0)));
		//LatR = Pi2 - (2 * Math.atan2((t * (part1**(Ec/2))),1));
		LatR = Pi2 - (2 * Math.atan(t * Math.pow(part1,(Ec/2))));
	} while (Math.abs(LatR - Lat0) > 0.000000002);

	// Convert from radians to degrees.
	var Lat = LatR / AngRad;
	var Lon = LonR / AngRad;
	return Lat + "," + Lon;
}		// end of function waSpSz2DMS