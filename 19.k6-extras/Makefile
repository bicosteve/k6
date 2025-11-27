test:
	k6 run test.js

test_summary:
	k6 run test.js --summary-mode=full

cloud_test:
	k6 cloud remote-script.js

local_test:
	k6 run remote-script.js -o cloud
