const router = require('express').Router();
const AWS = require('aws-sdk');
const dotenv = require('dotenv');
const {Readable} = require('stream');

dotenv.config();

// AWS.config.update({
// 	region: 'ap-south-1'
// });

router.get('/',(req,res) => {
	const range = req.headers.range;
	  if (!range) {
	    res.status(400).send("Requires Range header");
	  }

	let params = {
		Bucket: "testlecturestream", 
		Key: "s3_upload_demo.mp4", 
		// Range: "bytes=0-500"
	};
	let s3 = new AWS.S3();
	s3.headObject(params, function(err, data) {
		if (err) return console.log(err, err.stack); // an error occurred
		// console.log(data);           // successful response

		// const readableStream = new Stream.Readable();
		const videoSize = data.ContentLength;

	    const CHUNK_SIZE = 10 ** 6; // 1MB
	    const start = Number(range.replace(/\D/g, ""));
	    const end = Math.min(start + CHUNK_SIZE, videoSize - 1);


	    //GET DATA BUFFER FROM S3
	    params['Range'] = `bytes=${start}-${end}`;
	    let s3Video = new AWS.S3();
	    s3Video.getObject(params, async function(err,vidData) {
	    	if(err) return console.log(err,err.stack);

	    	// console.log(vidData);

	    	// Create headers
		    const contentLength = end - start + 1;
		    const headers = {
			    "Content-Range": `bytes ${start}-${end}/${videoSize}`,
			    "Accept-Ranges": "bytes",
			    "Content-Length": contentLength,
			    "Content-Type": vidData.ContentType,
		    };

		    // HTTP Status 206 for Partial Content
		    res.writeHead(206, headers);
		    // console.log(res);
		 	const readableStream = new Readable();
		  	readableStream.push(vidData.Body);
		  	readableStream.push(null);

		  	readableStream.pipe(res);
		  	// console.log('after stream write', send);

		});


	    
	});

	  

	  // get video stats (about 61MB)
	  // const videoSize = fs.statSync("bigbuck.mp4").size;

	  // // Parse Range
	  // // Example: "bytes=32324-"

	  

	  // create video read stream for this particular chunk
	  // const videoStream = fs.createReadStream(videoPath, { start, end });

	  // // Stream the video chunk to the client
	  // videoStream.pipe(res);



})


module.exports = router;