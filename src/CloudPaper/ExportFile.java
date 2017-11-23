package CloudPaper;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;

import org.apache.struts2.ServletActionContext;

public class ExportFile {
  private String fileName = "";
  private String resultString = "checkFailed";
  private byte[] pdfCache = null;

  public String getpdf() throws IOException {
    String dirString = ServletActionContext.getServletContext().getRealPath("") + getFileName();
    StringBuffer pdfCache = new StringBuffer();
    File file = new File(dirString);
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
      System.out.println("count:" + count);
      in.close();
    } catch (IOException e) {
      e.printStackTrace();
    }
    setPdfCache(cache);
    setResultString(new String(cache, "ISO-8859-1"));
    System.out.println(getResultString().length());

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

  /**
   * @return pdfCache
   */
  public byte[] getPdfCache() {
    return pdfCache;
  }

  /**
   * @param pdfCache
   *          要设置的 pdfCache
   */
  public void setPdfCache(byte[] pdfCache) {
    this.pdfCache = pdfCache;
  }
}
