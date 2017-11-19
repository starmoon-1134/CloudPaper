package com;

import java.sql.ResultSet;

import org.apache.struts2.ServletActionContext;

import com.opensymphony.xwork2.ActionInvocation;
import com.opensymphony.xwork2.interceptor.AbstractInterceptor;

import mysqlcon.SqlCon;

public class AuthCheck extends AbstractInterceptor {
  private static final long serialVersionUID = -5114658085937727056L;
  private String resultString = "";

  @Override
  public String intercept(ActionInvocation invocation) throws Exception {
    // 执行验证动作
    String username = (String) ServletActionContext.getRequest().getSession()
        .getAttribute("username");
    String password = (String) ServletActionContext.getRequest().getSession()
        .getAttribute("password");
    if (username == null) {
      resultString = "checkFail";
      return "tologin";
    }
    // System.out.println("username: " + username);
    // System.out.println("password: " + password);
    SqlCon userSql = new SqlCon();
    String queryUsername = "select * from useraccount where username=\'" + username + "\'";
    ResultSet usernameQueryRet = userSql.executeQuery(queryUsername);
    if (usernameQueryRet.next()) {
      if (usernameQueryRet.getString("password").equals(password)) {
        userSql.closeCon();
        return invocation.invoke();
      }
    }
    userSql.closeCon();
    System.out.println("check fail");
    resultString = "checkFail";
    return "tologin";
  }

  public String getResultString() {
    return resultString;
  }

  public void setResultString(String resultString) {
    this.resultString = resultString;
  }
}
