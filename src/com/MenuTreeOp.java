package com;

import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.io.OutputStreamWriter;

import org.apache.struts2.ServletActionContext;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

public class MenuTreeOp {
	private String result;
	private String userName;
	private String folderName;

	public String deleteFolder() {
		 try{  
            BufferedReader br = new BufferedReader(new FileReader(  
            		ServletActionContext.getServletContext().getRealPath("") + "\\config\\usertree.json"));
            BufferedWriter bw = new BufferedWriter(new FileWriter(  
            		ServletActionContext.getServletContext().getRealPath("") + "\\config\\new.json"));// 输出新的json文件  
            String s = "{\"path\": \"重庆*1111.pdf\"}";
            //JSONObject dataJson = new JSONObject(s);
            //rd.write(dataJson.toString());
            bw.write(s);
            //bw.write(dataJson.toString());
//                    while ((s = br.readLine()) != null){
//                    JSONObject dataJson = new JSONObject(s);
//                    System.out.println(dataJson);
//                    System.out.println(dataJson.get("path"));
//            } 
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
