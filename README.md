### start up
````shell
npm i
npm run build
node --prof dist/index.js
````

### create test user
````shell
curl -X GET "http://localhost:8080/newUser?username=matt&password=password"
````

### test v1 api (sync)
````shell
ab -k -c 20 -n 250 "http://localhost:8080/auth/v1?username=matt&password=password"
````

### test v2 api (async)
````shell
ab -k -c 20 -n 250 "http://localhost:8080/auth/v2?username=matt&password=password"
````

### generate summary file
````shell
node --prof-process isolate-0x110008000-v8.log > processed.txt
````


### reference

[nodejs.org simple-profiling](https://nodejs.org/en/docs/guides/simple-profiling/ "Markdown")

[stack overflow how-to-read-nodejs-internal-profiler-tick-processor-output](https://stackoverflow.com/questions/23934451/how-to-read-nodejs-internal-profiler-tick-processor-output "Markdown")