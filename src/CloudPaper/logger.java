package CloudPaper;

import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStreamWriter;
import java.io.PrintWriter;
import java.text.SimpleDateFormat;
import java.util.Date;

import org.apache.struts2.ServletActionContext;

enum logType {
  upLoadFile, renameFile, addNote, addLabel, removeLabel, changeLabel
}

public class logger {
  String userName = null;
  String fileName = null;
  String resultString = null;

  public void addLog(String operate, logType type) throws IOException {
    StringBuffer oneLog = new StringBuffer(this.getFormatDate());
    oneLog.append(" # ");
    oneLog.append(operate);
    oneLog.append(" # ");
    switch (type) {
      case upLoadFile:
        oneLog.append("upLoadFile");
        break;
      case renameFile:
        oneLog.append("renameFile");
        break;
      case addNote:
        oneLog.append("addNote");
        break;
      case addLabel:
        oneLog.append("addLabel");
        break;
      case removeLabel:
        oneLog.append("removeLabel");
        break;
      case changeLabel:
        oneLog.append("changeLabel");
        break;

      default:
        oneLog.append("undined");
        break;
    }

    String dirString = ServletActionContext.getServletContext().getRealPath("") + "userfiles\\"
        + userName + "\\" + "log\\" + fileName + ".log";
    File logFile = new File(dirString);
    if (!logFile.exists()) {
      logFile.createNewFile();
    }

    FileOutputStream foutputStream = new FileOutputStream(logFile, true);
    PrintWriter fout = new PrintWriter(
        new BufferedWriter(new OutputStreamWriter(foutputStream, "utf-8")));
    fout.println(oneLog.toString());
    fout.flush();
    fout.close();
  }

  public String getLog() throws IOException {
    String dirString = ServletActionContext.getServletContext().getRealPath("") + "userfiles\\"
        + userName + "\\" + "log\\" + fileName + ".log";
    File logFile = new File(dirString);

    if (!logFile.exists()) {
      setResultString("###$$$file lost!###$$$");
      return "error";
    }

    BufferedReader bufread;
    String read;
    StringBuffer tmpBuffer = new StringBuffer();
    bufread = new BufferedReader(new InputStreamReader(new FileInputStream(logFile), "utf-8"));
    while ((read = bufread.readLine()) != null) {
      tmpBuffer.append(read);
    }
    setResultString(tmpBuffer.toString());

    bufread.close();
    return "success";
  }

  private String getFormatDate() {
    Date date = new Date();
    SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
    String dateString = formatter.format(date);
    return dateString;
  }

  public void setResultString(String resultString) {
    this.resultString = resultString;
  }

  public String getResultString() {
    return resultString;
  }

  public void setFileName(String fileName) {
    this.fileName = fileName;
  }

  public String getFileName() {
    return fileName;
  }

  public void setUserName(String userName) {
    this.userName = userName;
  }

  public String getUserName() {
    return userName;
  }

}
