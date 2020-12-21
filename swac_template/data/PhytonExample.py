"""
to start with phyton, you need to install requests:
pip install requests
OR
conda install requests
"""

import requests

#response is an object
response = requests.get("http://epigraf01.ad.fh-bielefeld.de:8080/SmartDataTeststand/smartdata/records/data_11?storage=smartmonitoring&includes=pmpp%2Cid%2Cu0%2Cumpp%2Cts%2Cmodule_temp&size=20&countonly=false&deflatt=false")

#you can make it to json like this:
import json

print(response.json())

"""
response.status_code

helps to find errors.
200: Everything went okay, and the result has been returned (if any).
301: The server is redirecting you to a different endpoint. This can happen when a company switches domain names, or an endpoint name is changed.
400: The server thinks you mad a bad request. This can happen when you do not send along the right data, among other things.
401: The server thinks you are not authenticated. Many APIs require login ccredentials, so this happens when you do not send the right credentials to access an AIP.
403: The resource you are trying to access is forbidden: you do not have the right permissions to see it.
404: The resource yuo tried to access was not found on the server.
503: The server is not ready to handle the request.
"""
