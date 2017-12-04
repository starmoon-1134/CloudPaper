package CloudPaper;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.Reader;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.apache.struts2.ServletActionContext;

import com.sun.org.apache.xerces.internal.impl.dv.util.Base64;

public class ExportFile {
  private String fileName = "";
  private String resultString = "checkFailed";

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
	//System.out.println("333");
    String RootDir = ServletActionContext.getServletContext().getRealPath("");
    String username = (String) ServletActionContext.getRequest().getSession()
        .getAttribute("username");
    String templateFileName = RootDir + "jsp\\exportFileTemplate.html";
    String noteFileName = RootDir + "userFiles\\" + username + "\\NoteDOM\\" + getFileName()
        + ".note";
    final String pdfCacheDiv = "<div id=pdfCache style=display:none;>";
    final String noteDiv = "<div id=Note>";
    final String title = "###Insert title here###";
    // 读取template、Note
    String templateString = readFile(templateFileName);
    String noteString = readFile(noteFileName);
    getpdf();
    // System.out.println(templateString.length());
    // System.out.println(noteString.length());
    // System.out.println(getResultString().length());

    // 插入pdf、note的数据
    Pattern pdfPattern = Pattern.compile(pdfCacheDiv);
    Pattern notePattern = Pattern.compile(noteDiv);
    Pattern titlePattern = Pattern.compile(title);
    Matcher pdfMatcher = pdfPattern.matcher(templateString);
    String finalString = pdfMatcher.replaceFirst(pdfCacheDiv + getResultString());
    Matcher noteMatcher = notePattern.matcher(finalString);
    finalString = noteMatcher.replaceFirst(noteDiv + noteString);
    Matcher titleMatcher = titlePattern.matcher(finalString);
    finalString = titleMatcher.replaceFirst(getFileName());

    setResultString(finalString);
    //System.out.println(finalString);
    return "success";
  }

  private String readFile(String fileName) {
    String tempString = "";
    File templateFile = new File(fileName);
    if (!templateFile.exists()) {
      return "";
    }
    Reader reader = null;
    try {
      // System.out.println("以字符为单位读取文件内容，一次读一个字节：");
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
    return tempString;
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