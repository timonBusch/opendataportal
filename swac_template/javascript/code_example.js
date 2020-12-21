


function setJavaExample(apiURL) {

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

    document.getElementById("example_java").innerText = exJava
}
