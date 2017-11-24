package CloudPaper;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.Reader;

import org.apache.struts2.ServletActionContext;

import com.sun.org.apache.xerces.internal.impl.dv.util.Base64;

public class ExportFile {
  private String fileName = "";
  private String resultString = null;

  public String getpdf() throws IOException {
    String username = (String) ServletActionContext.getRequest().getSession()
        .getAttribute("username");
    String RootDir = ServletActionContext.getServletContext().getRealPath("");
    String pdfFileName = RootDir + "/userFiles/" + username + "/pdf/" + getFileName();
    File file = new File(pdfFileName);
    InputStream in = null;
    byte[] cache = null;
    int count = 0;
    try {
      // 一次读一个字节
      in = new FileInputStream(file);
      cache = new byte[in.available()];
      int tempbyte;
      while ((tempbyte = in.read()) != -1) {
        cache[count++] = (byte) tempbyte;
      }
      // System.out.println("count:" + count);
      in.close();
    } catch (IOException e) {
      e.printStackTrace();
    }
    setResultString(Base64.encode(cache));
    // setResultString(new String(cache, "ISO-8859-1"));// ISO-8859-1可用
    // System.out.println(getResultString().length());

    return "success";
  }

  public String getStandardFile() throws IOException {
    String RootDir = ServletActionContext.getServletContext().getRealPath("");
    String templateFileName = RootDir + "/jsp/exportFileTemplate.html";
    // String standardFile = RootDir + "/userFiles/" + getUserName() + "/" + getFileName() +
    // ".html";
    String tempString = "";
    final String pdfCacheDiv = "<div id=pdfCache style=display:none;>";
    // 读取template
    File templateFile = new File(templateFileName);
    Reader reader = null;
    try {
      System.out.println("以字符为单位读取文件内容，一次读一个字节：");
      // 一次读一个字符
      reader = new InputStreamReader(new FileInputStream(templateFile));
      int tempchar;
      while ((tempchar = reader.read()) != -1) {
        // 对于windows下，\r\n这两个字符在一起时，表示一个换行。
        // 但如果这两个字符分开显示时，会换两次行。
        // 因此，屏蔽掉\r，或者屏蔽\n。否则，将会多出很多空行。
        if (((char) tempchar) != '\r') {
          tempString += (char) tempchar;
        }
      }
      reader.close();
    } catch (Exception e) {
      e.printStackTrace();
    }

    // 插入pdf的数据
    int insertPos = tempString.indexOf(pdfCacheDiv);
    getpdf();
    System.out.println(pdfCacheDiv.length());
    String finalString = tempString.substring(0, insertPos + pdfCacheDiv.length())
        + getResultString() + "\n" + tempString.substring(insertPos + pdfCacheDiv.length());

    setResultString(finalString);
    return "success";
  }

  public String getFileName() {
    return fileName;
  }

  public void setFileName(String fileName) {
    this.fileName = fileName;
  }

  /**
   * @return resultString
   */
  public String getResultString() {
    return resultString;
  }

  /**
   * @param resultString
   *          要设置的 resultString
   */
  public void setResultString(String resultString) {
    this.resultString = resultString;
  }

}