


function setExample(apiURL) {

    let exJava =
        "import java.io.BufferedReader;\n" +
        "import java.io.IOException;\n" +
        "import java.io.InputStreamReader;\n" +
        "import java.io.Reader;\n" +
        "import java.net.HttpURLConnection;\n" +
        "import java.net.MalformedURLException;\n" +
        "import java.net.ProtocolException;\n" +
        "import java.net.URL;\n" +
        "import java.util.Iterator;\n" +
        "import java.util.List;\n" +
        "\n" +
        "public class JavaBeispiel {\n" +
        "\n" +
        "    /**\n" +
        "     * Get only the response\n" +
        "     * @param restUrl response as String\n" +
        "     */\n" +
        "    public StringBuffer getData(String restUrl) {\n" +
        "\n" +
        "        try {\n" +
        "            URL url = new URL(restUrl);\n" +
        "            HttpURLConnection con = (HttpURLConnection) url.openConnection();\n" +
        "            con.setRequestMethod(\"GET\");\n" +
        "\n" +
        "            BufferedReader in = new BufferedReader(\n" +
        "                    new InputStreamReader(con.getInputStream()));\n" +
        "            String inputLine;\n" +
        "            StringBuffer content = new StringBuffer();\n" +
        "            while ((inputLine = in.readLine()) != null) {\n" +
        "                content.append(inputLine);\n" +
        "            }\n" +
        "            in.close();\n" +
        "            con.disconnect();\n" +
        "\n" +
        "            return content;\n" +
        "        }catch (MalformedURLException | ProtocolException m){\n" +
        "            System.out.println(\"Unknown protocol:\" + m.getMessage());\n" +
        "        } catch (IOException ioException) {\n" +
        "            ioException.printStackTrace();\n" +
        "        }\n" +
        "        return null;\n" +
        "    }\n" +
        "\n" +
        "    /**\n" +
        "     * Full response with headers, content-type, content-length ...\n" +
        "     * @param con http connection object\n" +
        "     * @return full reponse string\n" +
        "     * @throws IOException\n" +
        "     */\n" +
        "    public static String getFullResponse(HttpURLConnection con) throws IOException {\n" +
        "        StringBuilder fullResponseBuilder = new StringBuilder();\n" +
        "\n" +
        "        fullResponseBuilder.append(con.getResponseCode())\n" +
        "                .append(\" \")\n" +
        "                .append(con.getResponseMessage())\n" +
        "                .append(\"\\n\");\n" +
        "\n" +
        "        con.getHeaderFields()\n" +
        "                .entrySet()\n" +
        "                .stream()\n" +
        "                .filter(entry -> entry.getKey() != null)\n" +
        "                .forEach(entry -> {\n" +
        "\n" +
        "                    fullResponseBuilder.append(entry.getKey())\n" +
        "                            .append(\": \");\n" +
        "\n" +
        "                    List<String> headerValues = entry.getValue();\n" +
        "                    Iterator<String> it = headerValues.iterator();\n" +
        "                    if (it.hasNext()) {\n" +
        "                        fullResponseBuilder.append(it.next());\n" +
        "\n" +
        "                        while (it.hasNext()) {\n" +
        "                            fullResponseBuilder.append(\", \")\n" +
        "                                    .append(it.next());\n" +
        "                        }\n" +
        "                    }\n" +
        "\n" +
        "                    fullResponseBuilder.append(\"\\n\");\n" +
        "                });\n" +
        "\n" +
        "        Reader streamReader = null;\n" +
        "\n" +
        "        if (con.getResponseCode() > 299) {\n" +
        "            streamReader = new InputStreamReader(con.getErrorStream());\n" +
        "        } else {\n" +
        "            streamReader = new InputStreamReader(con.getInputStream());\n" +
        "        }\n" +
        "\n" +
        "        BufferedReader in = new BufferedReader(streamReader);\n" +
        "        String inputLine;\n" +
        "        StringBuilder content = new StringBuilder();\n" +
        "        while ((inputLine = in.readLine()) != null) {\n" +
        "            content.append(inputLine);\n" +
        "        }\n" +
        "\n" +
        "        in.close();\n" +
        "\n" +
        "        fullResponseBuilder.append(\"Response: \")\n" +
        "                .append(content);\n" +
        "\n" +
        "        return fullResponseBuilder.toString();\n" +
        "    }\n" +
        "\n" +
        "    public static void main(String[] args){\n" +
        "\n" +
        "        String urlString = \"" + apiURL + "\";\n" +
        "        try {\n" +
        "            URL url = new URL(urlString);\n" +
        "            HttpURLConnection con = (HttpURLConnection) url.openConnection();\n" +
        "            System.out.println(getFullResponse(con));\n" +
        "        } catch (IOException m){\n" +
        "            m.printStackTrace();\n" +
        "        }\n" +
        "\n" +
        "        JavaBeispiel j = new JavaBeispiel();\n" +
        "        StringBuffer t = j.getData(urlString);\n" +
        "        if(t != null) {\n" +
        "            System.out.println(t);\n" +
        "        }\n" +
        "\n" +
        "\n" +
        "    }\n" +
        "\n" +
        "\n" +
        "}\n"

    let exPython = "\"\"\"\n" +
        "to start with python, you need to install requests:\n" +
        "pip install requests\n" +
        "OR\n" +
        "conda install requests\n" +
        "\"\"\"\n" +
        "\n" +
        "import requests\n" +
        "import json\n" +
        "\n" +
        "#response is an object\n" +
        "response = requests.get(\""+ apiURL +"\")\n" +
        "\n" +
        "#you can make it to json like this:\n" +
        "print(response.json())\n" +
        "\n" +
        "\"\"\"\n" +
        "response.status_code\n" +
        "\n" +
        "helps to find errors.\n" +
        "200: Everything went okay, and the result has been returned (if any).\n" +
        "301: The server is redirecting you to a different endpoint. This can happen when a company switches domain names, or an endpoint name is changed.\n" +
        "400: The server thinks you mad a bad request. This can happen when you do not send along the right data, among other things.\n" +
        "401: The server thinks you are not authenticated. Many APIs require login ccredentials, so this happens when you do not send the right credentials to access an AIP.\n" +
        "403: The resource you are trying to access is forbidden: you do not have the right permissions to see it.\n" +
        "404: The resource yuo tried to access was not found on the server.\n" +
        "503: The server is not ready to handle the request.\n" +
        "\"\"\"\n"

    let exJavaScript =
        "function getData() {\n" +
        "    fetch(\""+ apiURL +"\").then(function(response) {\n" +
        "        return response.json();\n" +
        "    }).then(function(data) {\n" +
        "        console.log(data);\n" +
        "    }).catch(function() {\n" +
        "        console.log(\"Booo\");\n" +
        "    });\n" +
        "}"

    document.getElementById("example_java").innerText = exJava
    document.getElementById("example_python").innerText = exPython
    document.getElementById("example_javaScript").innerText = exJavaScript
}

