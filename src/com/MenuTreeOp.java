package com;

import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;

import org.apache.struts2.ServletActionContext;
import org.json.JSONException;
import org.json.JSONObject;

public class MenuTreeOp {
	private String result="";
	private String userName;
	private String folderName;

	public String initTree() {
		try{  
			BufferedReader inJson = new BufferedReader(new FileReader(  
            		ServletActionContext.getServletContext().getRealPath("") + 
            		"\\config\\" + getUserName() + ".json"));
			String curLine = "";
			while((curLine = inJson.readLine()) != null){
				result = result + curLine + "\n";
			 }
			 inJson.close();
         }catch(JSONException | IOException e) {  
        	e.printStackTrace();
        }
		return "success";
	}
	
	public String deleteFolder() {
		 int index = getFolderName().lastIndexOf("folders");
		 String desPath = getFolderName().substring(0, index);
		 System.out.println(desPath);
		 try{  
			BufferedReader inJson = new BufferedReader(new FileReader(  
            		ServletActionContext.getServletContext().getRealPath("") + "\\config\\usertree.json"));
			String deleteRet = "";
			String curLine = "";
			while((curLine = inJson.readLine()) != null){
				 if(curLine.indexOf("\"path\"") != -1) {
					 JSONObject curJson=new JSONObject(curLine);
					 String path=curJson.getString("path");
					 System.out.println(path);
					 if(!path.equals(desPath) && path.indexOf(desPath+">") != 0 && path.indexOf(desPath+"*") != 0) {
						 deleteRet = deleteRet + curLine + "\n";
						 System.out.println(deleteRet);
					 }
					 //System.out.println(path);
				 }else {
					 deleteRet = deleteRet + curLine + "\n";
				 }
			 }
			 inJson.close();
			 BufferedWriter outJson = new BufferedWriter(new FileWriter(  
					 ServletActionContext.getServletContext().getRealPath("") + "\\config\\usertree.json"));
			 outJson.write(deleteRet);
			 //System.out.println(deleteRet);
			 outJson.flush();
			 outJson.close();
         }catch(JSONException | IOException e) {  
        	e.printStackTrace();
        }
		return "success";
	}
	
	public String getFolderName() {
		return folderName;
	}

	public void setFolderName(String folderName) {
		this.folderName = folderName;
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
}
