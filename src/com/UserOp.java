package com;

import java.sql.ResultSet;
import java.sql.SQLException;

import mysqlcon.SqlCon;

public class UserOp {
	private String username;
	private String password;
	private String confirmpassword;
	private String result;
	
	public String userSignIn() {
		//System.out.println(getUsername());
		//System.out.println(getPassword());
		SqlCon userSql = new SqlCon();
		String queryUsername = "select * from useraccount where username=\'" + getUsername()+"\'";
		ResultSet usernameQueryRet=userSql.executeQuery(queryUsername);
		try {
			if(usernameQueryRet.next()) {
				if(usernameQueryRet.getString("password").equals(getPassword())) {
					userSql.closeCon();
					result = "validatesuccess";
					return "success";
				}else {
					userSql.closeCon();
					result = "passworderror";
					return "success";
				}
			}else {
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
//		System.out.println(getUsername());
//		System.out.println(getPassword());
//		System.out.println(getConfirmpassword());
		SqlCon userSql = new SqlCon();
		String queryUsername = "select * from useraccount where username=\'" + getUsername()+"\'";
		ResultSet usernameQueryRet=userSql.executeQuery(queryUsername);
		try {
			if(usernameQueryRet.next()) {
				userSql.closeCon();
				result = "usernameexist";
				return "success";
			}else {
				String userRegister="insert into useraccount " +
						 "(username,password) " + "values('" + getUsername() + "','" + getPassword() + "')";
				userSql.executeUpdate(userRegister);
				userSql.closeCon();
				result = "registersuccess";
				return "success";
			}
		} catch (SQLException e) {
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
