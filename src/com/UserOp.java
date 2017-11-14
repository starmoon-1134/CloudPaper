package com;

import java.io.BufferedWriter;
import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.sql.ResultSet;
import java.sql.SQLException;

import org.apache.struts2.ServletActionContext;

import mysqlcon.SqlCon;

public class UserOp {
  private String username;
  private String password;
  private String confirmpassword;
  private String result;

  public String userSignIn() {
    // System.out.println(getUsername());
    // System.out.println(getPassword());
    SqlCon userSql = new SqlCon();
    String queryUsername = "select * from useraccount where username=\'" + getUsername() + "\'";
    ResultSet usernameQueryRet = userSql.executeQuery(queryUsername);
    try {
      if (usernameQueryRet.next()) {
        if (usernameQueryRet.getString("password").equals(getPassword())) {
          userSql.closeCon();
          result = "validatesuccess";
          return "success";
        } else {
          userSql.closeCon();
          result = "passworderror";
          return "success";
        }
      } else {
        userSql.closeCon();
        result = "nousername";
        return "success";
      }
    } catch (SQLException e) {
      userSql.closeCon();
      e.printStackTrace();
    }
    return "success";
  }

  public String userRegister() {
    // System.out.println(getUsername());
    // System.out.println(getPassword());
    // System.out.println(getConfirmpassword());
    SqlCon userSql = new SqlCon();
    String queryUsername = "select * from useraccount where username=\'" + getUsername() + "\'";
    ResultSet usernameQueryRet = userSql.executeQuery(queryUsername);
    try {
      if (usernameQueryRet.next()) {
        userSql.closeCon();
        result = "usernameexist";
        return "success";
      } else {
        String userRegister = "insert into useraccount " + "(username,password) " + "values('"
            + getUsername() + "','" + getPassword() + "')";
        userSql.executeUpdate(userRegister);
        userSql.closeCon();
        result = "registersuccess";

        String userFiles = ServletActionContext.getServletContext().getRealPath("")
            + "\\userFiles\\" + username;
        File usernameDir = new File(userFiles);
        File configDir = new File(userFiles + "\\config");
        File pdfDir = new File(userFiles + "\\pdf");
        File NoteDOMDir = new File(userFiles + "\\NoteDOM");
        File logDir = new File(userFiles + "\\log");
        usernameDir.mkdir();
        configDir.mkdir();
        pdfDir.mkdir();
        NoteDOMDir.mkdir();
        logDir.mkdir();

        File systemJson = new File(userFiles + "\\config" + "\\system.json");
        File userJson = new File(userFiles + "\\config" + "\\" + username + ".json");
        if (!systemJson.exists()) {
          systemJson.createNewFile();
          String init = "{\"pathes\" :[" + "\n" + "{\"path\": \"粗读\"},\n" + "{\"path\": \"精读\"},\n"
              + "{\"path\": \"未读\"}\n" + "]}";
          BufferedWriter outJson = new BufferedWriter(
              new FileWriter(ServletActionContext.getServletContext().getRealPath(
                  "/userFiles/" + username + "/config") + File.separator + "system.json"));
          outJson.write(init);
          // System.out.println(deleteRet);
          outJson.flush();
          outJson.close();
        }
        if (!userJson.exists()) {
          userJson.createNewFile();
          String init = "{\"pathes\" :[" + "\n" + "]}";
          BufferedWriter outJson = new BufferedWriter(
              new FileWriter(ServletActionContext.getServletContext().getRealPath(
                  "/userFiles/" + username + "/config") + File.separator + username + ".json"));
          outJson.write(init);
          // System.out.println(deleteRet);
          outJson.flush();
          outJson.close();
        }

        return "success";
      }
    } catch (SQLException | IOException e) {
      e.printStackTrace();
    }
    return "success";
  }

  public String getUsername() {
    return username;
  }

  public void setUsername(String username) {
    this.username = username;
  }

  public String getPassword() {
    return password;
  }

  public void setPassword(String password) {
    this.password = password;
  }

  public String getConfirmpassword() {
    return confirmpassword;
  }

  public void setConfirmpassword(String confirmpassword) {
    this.confirmpassword = confirmpassword;
  }

  public String getResult() {
    return result;
  }

  public void setResult(String result) {
    this.result = result;
  }
}

