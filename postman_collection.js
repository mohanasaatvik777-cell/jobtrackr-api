{
  "info": {
    "_postman_id": "9f2a0b08-3da0-4290-86a1-d84a89b4e205",
    "name": "JobTrackr API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json",
    "_exporter_id": "51851070",
    "_collection_link": "https://go.postman.co/collection/51851070-9f2a0b08-3da0-4290-86a1-d84a89b4e205?source=collection_link"
  },
  "item": [
    {
      "name": "post 201",
      "request": {
        "method": "POST",
        "header": [],
        "body": {
          "mode": "raw",
          "raw": "{  \"company\": \"Thoranam\", \"role\": \"Full Stack Intern\", \"status\": \"Offer\", \"appliedOn\": \"2026-10-06\", \"priority\": \"Medium\" }",
          "options": {
            "raw": {
              "language": "json"
            }
          }
        },
        "url": {
          "raw": "{{baseUrl}}/api/applications/",
          "host": [
            "{{baseUrl}}"
          ],
          "path": [
            "api",
            "applications",
            ""
          ]
        }
      },
      "response": []
    },
    {
      "name": "get list 200",
      "request": {
        "method": "GET",
        "header": [],
        "url": {
          "raw": "{{baseUrl}}/api/applications/",
          "host": [
            "{{baseUrl}}"
          ],
          "path": [
            "api",
            "applications",
            ""
          ]
        }
      },
      "response": []
    },
    {
      "name": "get query parameters 200",
      "request": {
        "method": "GET",
        "header": [],
        "url": {
          "raw": "{{baseUrl}}/api/applications/?status=Applied&search=google",
          "host": [
            "{{baseUrl}}"
          ],
          "path": [
            "api",
            "applications",
            ""
          ],
          "query": [
            {
              "key": "status",
              "value": "Applied"
            },
            {
              "key": "search",
              "value": "google"
            }
          ]
        }
      },
      "response": []
    },
    {
      "name": "get by id 200",
      "request": {
        "method": "GET",
        "header": [],
        "url": {
          "raw": "{{baseUrl}}/api/applications/{{applicationId}}",
          "host": [
            "{{baseUrl}}"
          ],
          "path": [
            "api",
            "applications",
            "{{applicationId}}"
          ]
        }
      },
      "response": []
    },
    {
      "name": "patch by id 200",
      "request": {
        "method": "PATCH",
        "header": [],
        "body": {
          "mode": "raw",
          "raw": "{ \"status\": \"Interview\" }",
          "options": {
            "raw": {
              "language": "json"
            }
          }
        },
        "url": {
          "raw": "{{baseUrl}}/api/applications/{{applicationId}}",
          "host": [
            "{{baseUrl}}"
          ],
          "path": [
            "api",
            "applications",
            "{{applicationId}}"
          ]
        }
      },
      "response": []
    },
    {
      "name": "delete by id 204",
      "request": {
        "method": "DELETE",
        "header": [],
        "url": {
          "raw": "{{baseUrl}}/api/applications/{{applicationId}}",
          "host": [
            "{{baseUrl}}"
          ],
          "path": [
            "api",
            "applications",
            "{{applicationId}}"
          ]
        }
      },
      "response": []
    },
    {
      "name": "post data error - 400",
      "event": [
        {
          "listen": "test",
          "script": {
            "type": "text/javascript",
            "exec": [
              "pm.test(\"success is false\", () => {\r\n    pm.expect(pm.response.json().success).to.eql(false)\r\n})\r\npm.collectionVariables.set(\"applicationId\", pm.response.json().id)\r\npm.test(\"errors object exists\", () => {\r\n    pm.expect(pm.response.json()).to.have.property(\"errors\")\r\n})"
            ]
          }
        }
      ],
      "request": {
        "method": "POST",
        "header": [],
        "body": {
          "mode": "raw",
          "raw": "{  \"company\": \"T\", \"role\": \"Full Stack Intern\", \"status\": \"Offer\", \"appliedOn\": \"2026-10-06\", \"priority\": \"Medium\" }",
          "options": {
            "raw": {
              "language": "json"
            }
          }
        },
        "url": {
          "raw": "{{baseUrl}}/api/applications/",
          "host": [
            "{{baseUrl}}"
          ],
          "path": [
            "api",
            "applications",
            ""
          ]
        }
      },
      "response": []
    },
    {
      "name": "get wrong id - 404",
      "event": [
        {
          "listen": "test",
          "script": {
            "type": "text/javascript",
            "exec": [
              "pm.test(\"Status is 404\", () => {\r\n    pm.response.to.have.status(404)\r\n})\r\n\r\npm.test(\"success is false\", () => {\r\n    pm.expect(pm.response.json().success).to.eql(false)\r\n})\r\n\r\npm.test(\"errors object exists\", () => {\r\n    pm.expect(pm.response.json()).to.have.property(\"errors\")\r\n})"
            ]
          }
        }
      ],
      "request": {
        "method": "GET",
        "header": [],
        "url": {
          "raw": "{{baseUrl}}/api/applications/{{applicatoinId}}",
          "host": [
            "{{baseUrl}}"
          ],
          "path": [
            "api",
            "applications",
            "{{applicatoinId}}"
          ]
        }
      },
      "response": []
    },
    {
      "name": "patch update at wrong id 404",
      "event": [
        {
          "listen": "test",
          "script": {
            "type": "text/javascript",
            "exec": [
              "pm.test(\"Status is 404\", () => {\r\n    pm.response.to.have.status(404)\r\n})\r\n\r\npm.test(\"success is false\", () => {\r\n    pm.expect(pm.response.json().success).to.eql(false)\r\n})\r\n\r\npm.test(\"errors object exists\", () => {\r\n    pm.expect(pm.response.json()).to.have.property(\"errors\")\r\n})"
            ]
          }
        }
      ],
      "request": {
        "method": "PATCH",
        "header": [],
        "body": {
          "mode": "raw",
          "raw": "{\"status\":\"Interview\"}",
          "options": {
            "raw": {
              "language": "json"
            }
          }
        },
        "url": {
          "raw": "{{baseUrl}}/api/applications/applicationId}}",
          "host": [
            "{{baseUrl}}"
          ],
          "path": [
            "api",
            "applications",
            "applicationId}}"
          ]
        }
      },
      "response": []
    },
    {
      "name": "delete wrong id 404",
      "event": [
        {
          "listen": "test",
          "script": {
            "type": "text/javascript",
            "exec": [
              "pm.test(\"Status is 404\", () => {\r\n    pm.response.to.have.status(404)\r\n})\r\n\r\npm.test(\"success is false\", () => {\r\n    pm.expect(pm.response.json().success).to.eql(false)\r\n})\r\n\r\npm.test(\"errors object exists\", () => {\r\n    pm.expect(pm.response.json()).to.have.property(\"errors\")\r\n})"
            ]
          }
        }
      ],
      "request": {
        "method": "DELETE",
        "header": [],
        "url": {
          "raw": "{{baseUrl}}/api/applications/{{applicationId}}",
          "host": [
            "{{baseUrl}}"
          ],
          "path": [
            "api",
            "applications",
            "{{applicationId}}"
          ]
        }
      },
      "response": []
    },
    {
      "name": "http://localhost:5000/api/applications/",
      "request": {
        "method": "POST",
        "header": [],
        "body": {
          "mode": "raw",
          "raw": "{\"company\":\"I\",\"role\":\"L\",\"status\":\"Sex\",\"appliedOn\":\"2026-19-11\",\"priority\": \"Fuck you\"}",
          "options": {
            "raw": {
              "language": "json"
            }
          }
        },
        "url": {
          "raw": "http://localhost:5000/api/applications/",
          "protocol": "http",
          "host": [
            "localhost"
          ],
          "port": "5000",
          "path": [
            "api",
            "applications",
            ""
          ]
        }
      },
      "response": []
    },
    {
      "name": "slow",
      "request": {
        "method": "GET",
        "header": [],
        "url": {
          "raw": "http://localhost:5000/api/block",
          "protocol": "http",
          "host": [
            "localhost"
          ],
          "port": "5000",
          "path": [
            "api",
            "block"
          ]
        }
      },
      "response": []
    }
  ],
  "variable": [
    {
      "key": "baseUrl",
      "value": ""
    },
    {
      "key": "applicationId",
      "value": ""
    }
  ]
}