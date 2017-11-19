package com;

import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.File;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;

import org.apache.struts2.ServletActionContext;
import org.json.JSONException;
import org.json.JSONObject;

public class MenuTreeOp {
  private String result = "checkFailed";
  private String userName;
  private String deleteFolderName;
  private String addFolderName;
  private String addParentName;
  private String renameNewFolderName;
  private String renameOldFolderName;
  private String deleteFileName;
  private String deleteFilePath;
  private String renameNewFileName;
  private String renameOldFileName;
  private String renameFilePath;
  private String rootFolderName;
  private String newFileState;
  private String fileName;

  public String initUserTree() {
    // System.out.println(getUserName());
    result = "";
    try {
      BufferedReader inJson = new BufferedReader(new FileReader(ServletActionContext
          .getServletContext().getRealPath("/userFiles/" + getUserName() + "/config")
          + File.separator + getUserName() + ".json"));
      String curLine = "";
      while ((curLine = inJson.readLine()) != null) {
        result = result + curLine + "\n";
      }
      inJson.close();
    } catch (JSONException | IOException e) {
      e.printStackTrace();
    }
    return "success";
  }

  public String initSystemTree() {
    // System.out.println(getUserName());
    result = "";
    try {
      BufferedReader inJson = new BufferedReader(
          new FileReader(ServletActionContext.getServletContext().getRealPath(
              "/userFiles/" + getUserName() + "/config") + File.separator + "system.json"));
      String curLine = "";
      while ((curLine = inJson.readLine()) != null) {
        result = result + curLine + "\n";
      }
      inJson.close();
    } catch (JSONException | IOException e) {
      e.printStackTrace();
    }
    return "success";
  }

  public String addFolder() {
    result = "";
    int index = getAddParentName().lastIndexOf("folders");
    String parentPath = getAddParentName().substring(0, index);
    String newFolderPath = parentPath + ">" + getAddFolderName();
    try {
      BufferedReader inJson = new BufferedReader(new FileReader(ServletActionContext
          .getServletContext().getRealPath("/userFiles/" + getUserName() + "/config")
          + File.separator + getUserName() + ".json"));
      String curLine = "";
      String addRet = "";
      while ((curLine = inJson.readLine()) != null) {
        if (curLine.equals("{\"pathes\" :[")) {
          addRet = addRet + curLine + "\n";
        } else if (curLine.indexOf("\"path\"") != -1) {
          JSONObject curJson = new JSONObject(curLine);
          String path = curJson.getString("path");
          if (path.equals(newFolderPath)) {
            result = "exist";
            return "success";
          }
          addRet = addRet + curLine + "\n";
        } else {
          addRet = addRet.substring(0, addRet.length() - 1);
          addRet = addRet + ",\n";
          JSONObject newJson = new JSONObject();
          newJson.put("path", newFolderPath);
          addRet = addRet + newJson.toString() + "\n";
          addRet = addRet + curLine + "\n";
        }
      }
      inJson.close();
      BufferedWriter outJson = new BufferedWriter(new FileWriter(ServletActionContext
          .getServletContext().getRealPath("/userFiles/" + getUserName() + "/config")
          + File.separator + getUserName() + ".json"));
      outJson.write(addRet);
      outJson.flush();
      outJson.close();
      result = "complete";
    } catch (JSONException | IOException e) {
      e.printStackTrace();
    }
    return "success";
  }

  public String deleteFolder() {
    int index = getDeleteFolderName().lastIndexOf("folders");
    String desPath = getDeleteFolderName().substring(0, index);
    System.out.println(desPath);
    HashMap<String, Integer> pdfMap = new HashMap<String, Integer>();
    try {
      BufferedReader inJson = new BufferedReader(new FileReader(ServletActionContext
          .getServletContext().getRealPath("/userFiles/" + getUserName() + "/config")
          + File.separator + getUserName() + ".json"));
      String deleteRet = "";
      String curLine = "";
      while ((curLine = inJson.readLine()) != null) {
        if (curLine.equals("{\"pathes\" :[")) {
          deleteRet = deleteRet + curLine + "\n";
        } else if (curLine.indexOf("\"path\"") != -1) {
          JSONObject curJson = new JSONObject(curLine);
          String path = curJson.getString("path");
          // System.out.println(path);
          if (!path.equals(desPath) && path.indexOf(desPath + ">") != 0
              && path.indexOf(desPath + "*") != 0) {
            deleteRet = deleteRet + curLine + "\n";
            // System.out.println(deleteRet);
          } else {
            int lastIndex = path.lastIndexOf("*");
            if (lastIndex > 0) {
              String pdfName = path.substring(lastIndex + 1, path.length());
              pdfMap.put(pdfName, 0);
            }
          }
          // System.out.println(path);
        } else {
          if (deleteRet.charAt(deleteRet.lastIndexOf("\n") - 1) == ',') {
            deleteRet = deleteRet.substring(0, deleteRet.length() - 2);
            deleteRet = deleteRet + "\n";
          }
          deleteRet = deleteRet + curLine + "\n";
        }
      }
      inJson.close();
      BufferedWriter outJson = new BufferedWriter(new FileWriter(ServletActionContext
          .getServletContext().getRealPath("/userFiles/" + getUserName() + "/config")
          + File.separator + getUserName() + ".json"));
      outJson.write(deleteRet);
      // System.out.println(deleteRet);
      outJson.flush();
      outJson.close();

      inJson = new BufferedReader(new FileReader(ServletActionContext.getServletContext()
          .getRealPath("/userFiles/" + getUserName() + "/config") + File.separator + getUserName()
          + ".json"));
      while ((curLine = inJson.readLine()) != null) {
        if (curLine.indexOf("\"path\"") != -1) {
          JSONObject curJson = new JSONObject(curLine);
          String path = curJson.getString("path");
          // System.out.println(path);
          int lastIndex = path.lastIndexOf("*");
          if (lastIndex > 0) {
            String pdfName = path.substring(lastIndex + 1, path.length());
            if (pdfMap.containsKey(pdfName)) {
              pdfMap.put(pdfName, 1);
            }
          }
        }
      }
      inJson.close();
    } catch (JSONException | IOException e) {
      e.printStackTrace();
    }

    Iterator pdfIter = pdfMap.entrySet().iterator();
    while (pdfIter.hasNext()) {
      Map.Entry pdfEntry = (Map.Entry) pdfIter.next();
      if (pdfEntry.getValue().equals(0)) {
        try {
          BufferedReader inJson = new BufferedReader(
              new FileReader(ServletActionContext.getServletContext().getRealPath(
                  "/userFiles/" + getUserName() + "/config") + File.separator + "system.json"));
          String curLine = "";
          String deleteRet = "";
          while ((curLine = inJson.readLine()) != null) {
            if (curLine.equals("{\"pathes\" :[")) {
              deleteRet = deleteRet + curLine + "\n";
            } else if (curLine.indexOf("\"path\"") != -1) {
              JSONObject curJson = new JSONObject(curLine);
              String path = curJson.getString("path");
              int lastIndex = path.lastIndexOf("*");
              if (lastIndex > 0
                  && !path.substring(lastIndex + 1, path.length()).equals(pdfEntry.getKey())) {
                deleteRet = deleteRet + curLine + "\n";
              } else if (lastIndex < 0) {
                deleteRet = deleteRet + curLine + "\n";
              }
            } else {
              if (deleteRet.charAt(deleteRet.lastIndexOf("\n") - 1) == ',') {
                deleteRet = deleteRet.substring(0, deleteRet.length() - 2);
                deleteRet = deleteRet + "\n";
              }
              deleteRet = deleteRet + curLine + "\n";
            }
          }
          inJson.close();
          BufferedWriter outJson = new BufferedWriter(
              new FileWriter(ServletActionContext.getServletContext().getRealPath(
                  "/userFiles/" + getUserName() + "/config") + File.separator + "system.json"));
          outJson.write(deleteRet);
          // System.out.println(deleteRet);
          outJson.flush();
          outJson.close();
        } catch (JSONException | IOException e) {
          e.printStackTrace();
        }

        String fileNameString = ServletActionContext.getServletContext().getRealPath(
            "/userFiles/" + getUserName() + "/pdf") + File.separator + pdfEntry.getKey();
        // System.out.println(fileNameString);
        File tmpFile = new File(fileNameString);
        if (tmpFile.exists()) {
          tmpFile.delete();
        }
      }
    }
    result = "";
    return "success";
  }

  public String renameFolder() {
    result = "";
    // System.out.println(getChangeOldFolderName());
    // System.out.println(getChangeNewFolderName());
    int index = getRenameOldFolderName().lastIndexOf("folders");
    String oldName = getRenameOldFolderName().substring(0, index);
    index = oldName.lastIndexOf(">");
    String newName = "";
    if (index == -1) {
      newName = getRenameNewFolderName();
    } else {
      newName = oldName.substring(0, index) + ">" + getRenameNewFolderName();
    }
    // System.out.println(oldName);
    // System.out.println(newName);
    try {
      BufferedReader inJson = new BufferedReader(new FileReader(ServletActionContext
          .getServletContext().getRealPath("/userFiles/" + getUserName() + "/config")
          + File.separator + getUserName() + ".json"));
      String renameRet = "";
      String curLine = "";
      while ((curLine = inJson.readLine()) != null) {
        if (curLine.equals("{\"pathes\" :[")) {
          renameRet = renameRet + curLine + "\n";
        } else if (curLine.indexOf("\"path\"") != -1) {
          JSONObject curJson = new JSONObject(curLine);
          String path = curJson.getString("path");
          if (path.equals(newName) || path.indexOf(newName + ">") == 0
              || path.indexOf(newName + "*") == 0) {
            result = "exist";
            return "success";
          }
          if (path.equals(oldName) || path.indexOf(oldName + ">") == 0
              || path.indexOf(oldName + "*") == 0) {
            path = newName + path.substring(oldName.length(), path.length());
            // System.out.println(path);
            JSONObject tmpJson = new JSONObject();
            tmpJson.put("path", path);
            renameRet = renameRet + tmpJson.toString() + ",\n";
          } else {
            renameRet = renameRet + curLine + "\n";
          }
        } else {
          if (renameRet.charAt(renameRet.lastIndexOf("\n") - 1) == ',') {
            renameRet = renameRet.substring(0, renameRet.length() - 2);
            renameRet = renameRet + "\n";
          }
          renameRet = renameRet + curLine + "\n";
        }
      }
      inJson.close();
      BufferedWriter outJson = new BufferedWriter(new FileWriter(ServletActionContext
          .getServletContext().getRealPath("/userFiles/" + getUserName() + "/config")
          + File.separator + getUserName() + ".json"));
      outJson.write(renameRet);
      // System.out.println(deleteRet);
      outJson.flush();
      outJson.close();
      result = "complete";
    } catch (JSONException | IOException e) {
      e.printStackTrace();
    }
    return "success";
  }

  public String deleteFile() {
    result = "";
    // System.out.println(getDeleteFileName());
    // System.out.println(getDeleteFilePath());
    int index = getDeleteFilePath().lastIndexOf("files");
    String filePath = getDeleteFilePath().substring(0, index);
    String desPath = filePath + "*" + getDeleteFileName();
    int deleteFlag = 0;
    // System.out.println(desPath);
    try {
      BufferedReader inJson = new BufferedReader(new FileReader(ServletActionContext
          .getServletContext().getRealPath("/userFiles/" + getUserName() + "/config")
          + File.separator + getUserName() + ".json"));
      String curLine = "";
      String deleteRet = "";
      while ((curLine = inJson.readLine()) != null) {
        if (curLine.equals("{\"pathes\" :[")) {
          deleteRet = deleteRet + curLine + "\n";
        } else if (curLine.indexOf("\"path\"") != -1) {
          JSONObject curJson = new JSONObject(curLine);
          String path = curJson.getString("path");
          if (!path.equals(desPath)) {
            deleteRet = deleteRet + curLine + "\n";
            int lastIndex = path.lastIndexOf("*");
            if (lastIndex > 0
                && path.substring(lastIndex + 1, path.length()).equals(getDeleteFileName())) {
              deleteFlag = 1;
            }
          }
        } else {
          if (deleteRet.charAt(deleteRet.lastIndexOf("\n") - 1) == ',') {
            deleteRet = deleteRet.substring(0, deleteRet.length() - 2);
            deleteRet = deleteRet + "\n";
          }
          deleteRet = deleteRet + curLine + "\n";
        }
      }
      inJson.close();
      BufferedWriter outJson = new BufferedWriter(new FileWriter(ServletActionContext
          .getServletContext().getRealPath("/userFiles/" + getUserName() + "/config")
          + File.separator + getUserName() + ".json"));
      outJson.write(deleteRet);
      // System.out.println(deleteRet);
      outJson.flush();
      outJson.close();
      result = "complete";
    } catch (JSONException | IOException e) {
      e.printStackTrace();
    }

    if (deleteFlag == 0) {
      try {
        BufferedReader inJson = new BufferedReader(
            new FileReader(ServletActionContext.getServletContext().getRealPath(
                "/userFiles/" + getUserName() + "/config") + File.separator + "system.json"));
        String curLine = "";
        String deleteRet = "";
        while ((curLine = inJson.readLine()) != null) {
          if (curLine.equals("{\"pathes\" :[")) {
            deleteRet = deleteRet + curLine + "\n";
          } else if (curLine.indexOf("\"path\"") != -1) {
            JSONObject curJson = new JSONObject(curLine);
            String path = curJson.getString("path");
            int lastIndex = path.lastIndexOf("*");
            if (lastIndex > 0
                && !path.substring(lastIndex + 1, path.length()).equals(getDeleteFileName())) {
              deleteRet = deleteRet + curLine + "\n";
            } else if (lastIndex < 0) {
              deleteRet = deleteRet + curLine + "\n";
            }
          } else {
            if (deleteRet.charAt(deleteRet.lastIndexOf("\n") - 1) == ',') {
              deleteRet = deleteRet.substring(0, deleteRet.length() - 2);
              deleteRet = deleteRet + "\n";
            }
            deleteRet = deleteRet + curLine + "\n";
          }
        }
        inJson.close();
        BufferedWriter outJson = new BufferedWriter(
            new FileWriter(ServletActionContext.getServletContext().getRealPath(
                "/userFiles/" + getUserName() + "/config") + File.separator + "system.json"));
        outJson.write(deleteRet);
        // System.out.println(deleteRet);
        outJson.flush();
        outJson.close();
      } catch (JSONException | IOException e) {
        e.printStackTrace();
      }

      String fileNameString = ServletActionContext.getServletContext().getRealPath(
          "/userFiles/" + getUserName() + "/pdf") + File.separator + getDeleteFileName();
      // System.out.println(fileNameString);
      File tmpFile = new File(fileNameString);
      if (tmpFile.exists()) {
        tmpFile.delete();
      }
    }
    return "success";
  }

  public String renameFile() {
    result = "";
    // System.out.println(getChangeOldFolderName());
    // System.out.println(getChangeNewFolderName());
    int fileOrderNum = 0;

    String oldFileName = ServletActionContext.getServletContext().getRealPath(
        "/userFiles/" + getUserName() + "/pdf") + File.separator + getRenameOldFileName();
    String newFileName = ServletActionContext.getServletContext().getRealPath(
        "/userFiles/" + getUserName() + "/pdf") + File.separator + getRenameNewFileName() + ".pdf";
    File tmpFile = new File(newFileName);
    while (tmpFile.exists()) {
      fileOrderNum++;
      newFileName = ServletActionContext.getServletContext()
          .getRealPath("/userFiles/" + getUserName() + "/pdf") + File.separator
          + getRenameNewFileName() + ".pdf" + "(" + fileOrderNum + ")";
      tmpFile = new File(newFileName);
    }

    // System.out.println(oldFileName);
    // System.out.println(newFileName);
    File oldFile = new File(oldFileName);
    File newFile = new File(newFileName);
    if (oldFile.exists()) {
      oldFile.renameTo(newFile);
    }

    int index = getRenameFilePath().lastIndexOf("files");
    String filePath = getRenameFilePath().substring(0, index);
    String desPath = filePath + "*" + getRenameOldFileName();
    String newPath;
    if (fileOrderNum == 0) {
      newPath = filePath + "*" + getRenameNewFileName() + ".pdf";
    } else {
      newPath = filePath + "*" + getRenameNewFileName() + ".pdf" + "(" + fileOrderNum + ")";
    }
    try {
      BufferedReader inJson = new BufferedReader(new FileReader(ServletActionContext
          .getServletContext().getRealPath("/userFiles/" + getUserName() + "/config")
          + File.separator + getUserName() + ".json"));
      String curLine = "";
      String renameRet = "";
      while ((curLine = inJson.readLine()) != null) {
        if (curLine.equals("{\"pathes\" :[")) {
          renameRet = renameRet + curLine + "\n";
        } else if (curLine.indexOf("\"path\"") != -1) {
          JSONObject curJson = new JSONObject(curLine);
          String path = curJson.getString("path");
          if (!path.equals(desPath)) {
            renameRet = renameRet + curLine + "\n";
          }
        } else {
          JSONObject newJson = new JSONObject();
          newJson.put("path", newPath);
          if (renameRet.charAt(renameRet.lastIndexOf("\n") - 1) != ',') {
            renameRet = renameRet.substring(0, renameRet.length() - 1);
            renameRet = renameRet + ",\n";
          }
          renameRet = renameRet + newJson.toString() + "\n";
          renameRet = renameRet + curLine + "\n";
        }
      }
      inJson.close();
      BufferedWriter outJson = new BufferedWriter(new FileWriter(ServletActionContext
          .getServletContext().getRealPath("/userFiles/" + getUserName() + "/config")
          + File.separator + getUserName() + ".json"));
      outJson.write(renameRet);
      // System.out.println(deleteRet);
      outJson.flush();
      outJson.close();
      result = "complete";
    } catch (JSONException | IOException e) {
      e.printStackTrace();
    }

    try {
      BufferedReader inJson = new BufferedReader(
          new FileReader(ServletActionContext.getServletContext().getRealPath(
              "/userFiles/" + getUserName() + "/config") + File.separator + "system.json"));
      String curLine = "";
      String renameRet = "";
      while ((curLine = inJson.readLine()) != null) {
        if (curLine.equals("{\"pathes\" :[")) {
          renameRet = renameRet + curLine + "\n";
        } else if (curLine.indexOf("\"path\"") != -1) {
          JSONObject curJson = new JSONObject(curLine);
          String path = curJson.getString("path");
          int lastIndex = path.lastIndexOf("*");
          if (lastIndex > 0
              && path.substring(lastIndex + 1, path.length()).equals(getRenameOldFileName())) {
            String tmpPath = path.substring(0, lastIndex + 1) + getRenameNewFileName() + ".pdf";
            if (fileOrderNum != 0) {
              tmpPath = tmpPath + "(" + fileOrderNum + ")";
            }
            JSONObject newJson = new JSONObject();
            newJson.put("path", tmpPath);
            renameRet = renameRet + newJson.toString() + ",\n";
          } else {
            renameRet = renameRet + curLine + "\n";
          }
        } else {
          if (renameRet.charAt(renameRet.lastIndexOf("\n") - 1) == ',') {
            renameRet = renameRet.substring(0, renameRet.length() - 2);
            renameRet = renameRet + "\n";
          }
          renameRet = renameRet + curLine + "\n";
        }
      }
      inJson.close();
      BufferedWriter outJson = new BufferedWriter(
          new FileWriter(ServletActionContext.getServletContext().getRealPath(
              "/userFiles/" + getUserName() + "/config") + File.separator + "system.json"));
      outJson.write(renameRet);
      // System.out.println(deleteRet);
      outJson.flush();
      outJson.close();
    } catch (JSONException | IOException e) {
      e.printStackTrace();
    }
    return "success";
  }

  public String addRootFolder() {
    try {
      BufferedReader inJson = new BufferedReader(new FileReader(ServletActionContext
          .getServletContext().getRealPath("/userFiles/" + getUserName() + "/config")
          + File.separator + getUserName() + ".json"));
      String curLine = "";
      String addRet = "";
      while ((curLine = inJson.readLine()) != null) {
        if (curLine.equals("{\"pathes\" :[")) {
          addRet = addRet + curLine + "\n";
        } else if (curLine.indexOf("\"path\"") != -1) {
          JSONObject curJson = new JSONObject(curLine);
          String path = curJson.getString("path");
          if (path.indexOf(getRootFolderName()) == 0) {
            result = "exist";
            return "success";
          }
          addRet = addRet + curLine + "\n";
        } else {
          JSONObject newJson = new JSONObject();
          newJson.put("path", getRootFolderName());
          if (!addRet.equals("{\"pathes\" :[" + "\n")) {
            addRet = addRet.substring(0, addRet.length() - 1);
            addRet = addRet + ",\n";
          }
          addRet = addRet + newJson.toString() + "\n";
          addRet = addRet + curLine + "\n";
        }
      }
      inJson.close();
      BufferedWriter outJson = new BufferedWriter(new FileWriter(ServletActionContext
          .getServletContext().getRealPath("/userFiles/" + getUserName() + "/config")
          + File.separator + getUserName() + ".json"));
      outJson.write(addRet);
      outJson.flush();
      outJson.close();
      result = "complete";
    } catch (JSONException | IOException e) {
      e.printStackTrace();
    }
    return "success";
  }

  public String changeFileState() {
    String newFileStatePath;
    switch (getNewFileState()) {
      case "intensive":
        newFileStatePath = "精读*" + getFileName();
        break;
      case "rough":
        newFileStatePath = "粗读*" + getFileName();
        break;
      default:
        newFileStatePath = "未读*" + getFileName();
        break;
    }
    System.out.println(newFileStatePath);
    try {
      BufferedReader inJson = new BufferedReader(
          new FileReader(ServletActionContext.getServletContext().getRealPath(
              "/userFiles/" + getUserName() + "/config") + File.separator + "system.json"));
      String changeRet = "";
      String curLine = "";
      while ((curLine = inJson.readLine()) != null) {
        if (curLine.equals("{\"pathes\" :[")) {
          changeRet = changeRet + curLine + "\n";
        } else if (curLine.indexOf("\"path\"") != -1) {
          JSONObject curJson = new JSONObject(curLine);
          String path = curJson.getString("path");
          int lastIndex = path.lastIndexOf("*");
          if (lastIndex > 0
              && !path.substring(lastIndex + 1, path.length()).equals(getFileName())) {
            changeRet = changeRet + curLine + "\n";
          } else if (lastIndex < 0) {
            changeRet = changeRet + curLine + "\n";
          }
        } else {
          if (changeRet.charAt(changeRet.lastIndexOf("\n") - 1) != ',') {
            changeRet = changeRet.substring(0, changeRet.length() - 1);
            changeRet = changeRet + ",\n";
          }
          JSONObject newJson = new JSONObject();
          newJson.put("path", newFileStatePath);
          changeRet = changeRet + newJson.toString() + "\n";
          changeRet = changeRet + curLine + "\n";
        }
      }
      inJson.close();
      BufferedWriter outJson = new BufferedWriter(
          new FileWriter(ServletActionContext.getServletContext().getRealPath(
              "/userFiles/" + getUserName() + "/config") + File.separator + "system.json"));
      outJson.write(changeRet);
      // System.out.println(deleteRet);
      outJson.flush();
      outJson.close();
    } catch (JSONException | IOException e) {
      e.printStackTrace();
    }
    result = "";
    return "success";
  }

  public String getResult() {
    return result;
  }

  public void setResult(String result) {
    this.result = result;
  }

  public String getUserName() {
    return userName;
  }

  public void setUserName(String userName) {
    this.userName = userName;
  }

  public String getDeleteFolderName() {
    return deleteFolderName;
  }

  public void setDeleteFolderName(String deleteFolderName) {
    this.deleteFolderName = deleteFolderName;
  }

  public String getAddFolderName() {
    return addFolderName;
  }

  public void setAddFolderName(String addFolderName) {
    this.addFolderName = addFolderName;
  }

  public String getAddParentName() {
    return addParentName;
  }

  public void setAddParentName(String addParentName) {
    this.addParentName = addParentName;
  }

  public String getRenameNewFolderName() {
    return renameNewFolderName;
  }

  public void setRenameNewFolderName(String renameNewFolderName) {
    this.renameNewFolderName = renameNewFolderName;
  }

  public String getRenameOldFolderName() {
    return renameOldFolderName;
  }

  public void setRenameOldFolderName(String renameOldFolderName) {
    this.renameOldFolderName = renameOldFolderName;
  }

  public String getDeleteFileName() {
    return deleteFileName;
  }

  public void setDeleteFileName(String deleteFileName) {
    this.deleteFileName = deleteFileName;
  }

  public String getDeleteFilePath() {
    return deleteFilePath;
  }

  public void setDeleteFilePath(String deleteFilePath) {
    this.deleteFilePath = deleteFilePath;
  }

  public String getRenameNewFileName() {
    return renameNewFileName;
  }

  public void setRenameNewFileName(String renameNewFileName) {
    this.renameNewFileName = renameNewFileName;
  }

  public String getRenameOldFileName() {
    return renameOldFileName;
  }

  public void setRenameOldFileName(String renameOldFileName) {
    this.renameOldFileName = renameOldFileName;
  }

  public String getRenameFilePath() {
    return renameFilePath;
  }

  public void setRenameFilePath(String renameFilePath) {
    this.renameFilePath = renameFilePath;
  }

  public String getRootFolderName() {
    return rootFolderName;
  }

  public void setRootFolderName(String rootFolderName) {
    this.rootFolderName = rootFolderName;
  }

  public String getNewFileState() {
    return newFileState;
  }

  public void setNewFileState(String newFileState) {
    this.newFileState = newFileState;
  }

  public String getFileName() {
    return fileName;
  }

  public void setFileName(String fileName) {
    this.fileName = fileName;
  }
}
