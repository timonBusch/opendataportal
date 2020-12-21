import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.Reader;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.ProtocolException;
import java.net.URL;
import java.util.Iterator;
import java.util.List;

public class JavaBeispiel {

    /**
     * Get only the response
     * @param restUrl response as String
     */
    public StringBuffer getData(String restUrl) {

        try {
            URL url = new URL(restUrl);
            HttpURLConnection con = (HttpURLConnection) url.openConnection();
            con.setRequestMethod("GET");

            BufferedReader in = new BufferedReader(
                    new InputStreamReader(con.getInputStream()));
            String inputLine;
            StringBuffer content = new StringBuffer();
            while ((inputLine = in.readLine()) != null) {
                content.append(inputLine);
            }
            in.close();
            con.disconnect();

            return content;
        }catch (MalformedURLException | ProtocolException m){
            System.out.println("Unknown protocol:" + m.getMessage());
        } catch (IOException ioException) {
            ioException.printStackTrace();
        }
        return null;
    }

    /**
     * Full response with headers, content-type, content-length ...
     * @param con http connection object
     * @return full reponse string
     * @throws IOException
     */
    public static String getFullResponse(HttpURLConnection con) throws IOException {
        StringBuilder fullResponseBuilder = new StringBuilder();

        fullResponseBuilder.append(con.getResponseCode())
                .append(" ")
                .append(con.getResponseMessage())
                .append("\n");

        con.getHeaderFields()
                .entrySet()
                .stream()
                .filter(entry -> entry.getKey() != null)
                .forEach(entry -> {

                    fullResponseBuilder.append(entry.getKey())
                            .append(": ");

                    List<String> headerValues = entry.getValue();
                    Iterator<String> it = headerValues.iterator();
                    if (it.hasNext()) {
                        fullResponseBuilder.append(it.next());

                        while (it.hasNext()) {
                            fullResponseBuilder.append(", ")
                                    .append(it.next());
                        }
                    }

                    fullResponseBuilder.append("\n");
                });

        Reader streamReader = null;

        if (con.getResponseCode() > 299) {
            streamReader = new InputStreamReader(con.getErrorStream());
        } else {
            streamReader = new InputStreamReader(con.getInputStream());
        }

        BufferedReader in = new BufferedReader(streamReader);
        String inputLine;
        StringBuilder content = new StringBuilder();
        while ((inputLine = in.readLine()) != null) {
            content.append(inputLine);
        }

        in.close();

        fullResponseBuilder.append("Response: ")
                .append(content);

        return fullResponseBuilder.toString();
    }

    public static void main(String[] args){

        String urlString = "http://epigraf01.ad.fh-bielefeld.de:8080/SmartDataTeststand/smartdata/records/data_11?storage=smartmonitoring&includes=pmpp%2Cid%2Cu0%2Cumpp%2Cts%2Cmodule_temp&size=20&countonly=false&deflatt=false";
        try {
            URL url = new URL(urlString);
            HttpURLConnection con = (HttpURLConnection) url.openConnection();
            System.out.println(getFullResponse(con));
        } catch (IOException m){
            m.printStackTrace();
        }

        JavaBeispiel j = new JavaBeispiel();
        StringBuffer t = j.getData(urlString);
        if(t != null) {
            System.out.println(t);
        }


    }


}
