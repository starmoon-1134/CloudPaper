package CloudPaper;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileOutputStream;
import java.io.FileReader;
import java.io.IOException;

import org.apache.struts2.ServletActionContext;

public class NoteManager {
  private String mDOMString = null;
  private String userID = null;
  private String fileName = null;
  private String resultString = null;

  public String saveDOMString() throws IOException {
    fileName = fileName.substring(0, fileName.lastIndexOf("."));
    String dirString = ServletActionContext.getServletContext().getRealPath("")
        + "userfiles\\NoteDOM\\" + userID + "____" + fileName;
    System.out.println(dirString);

    File fileToSave = new File(dirString);
    if (!fileToSave.exists()) {
      fileToSave.createNewFile();
    }

    FileOutputStream fout = new FileOutputStream(fileToSave);
    fout.write(mDOMString.getBytes());
    fout.flush();
    fout.close();

    // System.out.println(mDOMString);
    // System.out.println(fileName);
    // System.out.println(userID);

    setResultString("success");
    return "success";
  }

  public String loadDOMString() throws IOException {
    fileName = fileName.substring(0, fileName.lastIndexOf("."));
    String dirString = ServletActionContext.getServletContext().getRealPath("")
        + "userfiles\\NoteDOM\\" + userID + "____" + fileName;
    // System.out.println(dirString);

    File fileToLoad = new File(dirString);
    if (!fileToLoad.exists()) {
      setResultString("file lost!");
      return "error";
    }

    BufferedReader bufread;
    String read;
    StringBuffer tmpBuffer = new StringBuffer();
    bufread = new BufferedReader(new FileReader(fileToLoad));
    while ((read = bufread.readLine()) != null) {
      tmpBuffer.append(read);
    }
    bufread.close();
    setResultString(tmpBuffer.toString());

    // System.out.println(mDOMString);
    // System.out.println(fileName);
    // System.out.println(userID);

    return "success";
  }

  public String getmDOMString() {
    return mDOMString;
  }

  public void setmDOMString(String mDOMString) {
    this.mDOMString = mDOMString;
  }

  public String getUserID() {
    return userID;
  }

  public void setUserID(String userID) {
    this.userID = userID;
  }

  public String getFiliName() {
    return fileName;
  }

  public void setFileName(String fileName) {
    this.fileName = fileName;
  }

  public String getResultString() {
    return resultString;
  }

  public void setResultString(String resultString) {
    this.resultString = resultString;
  }
}
