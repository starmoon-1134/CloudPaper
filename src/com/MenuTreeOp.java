package com;

import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;
import java.io.RandomAccessFile;

import org.apache.struts2.ServletActionContext;
import org.json.JSONException;
import org.json.JSONObject;

public class MenuTreeOp {
	private String result="";
	private String userName;
	private String deleteFolderName;
	private String addFolderName;
	private String addParentName;
	private String renameNewFolderName;
	private String renameOldFolderName;

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
	
	public String addFolder() {
		result="";
		int index = getAddParentName().lastIndexOf("folders");
		String parentPath = getAddParentName().substring(0, index);
		String newFolderPath=parentPath+">"+getAddFolderName();
		try{  
			BufferedReader inJson = new BufferedReader(new FileReader(  
            		ServletActionContext.getServletContext().getRealPath("") + "\\config\\usertree.json"));
			String curLine = "";
			String addRet="";
			while((curLine = inJson.readLine()) != null){
				 if(curLine.equals("{\"pathes\" :[")) {
					 addRet=addRet+curLine+"\n";
				 }else if(curLine.indexOf("\"path\"") != -1) {
					 JSONObject curJson=new JSONObject(curLine);
					 String path=curJson.getString("path");
					 if(path.equals(newFolderPath)) {
						 result="exist";
						 return "success";
					 }
					 addRet=addRet+curLine+"\n";
				 }else {
					 addRet=addRet.substring(0, addRet.length()-1);
					 addRet=addRet+",\n";
					 JSONObject newJson=new JSONObject();
					 newJson.put("path", newFolderPath);
					 addRet=addRet+newJson.toString()+"\n";
					 addRet=addRet+curLine+"\n";
				 }
			}
			inJson.close();
			BufferedWriter outJson = new BufferedWriter(new FileWriter(  
					 ServletActionContext.getServletContext().getRealPath("") + "\\config\\usertree.json"));
			outJson.write(addRet);
			outJson.flush();
			outJson.close();
			result="complete";
		}catch(JSONException | IOException e) {  
        	e.printStackTrace();
        }
		return "success";
	}
	
	public String deleteFolder() {
		 int index = getDeleteFolderName().lastIndexOf("folders");
		 String desPath = getDeleteFolderName().substring(0, index);
		 System.out.println(desPath);
		 try{  
			BufferedReader inJson = new BufferedReader(new FileReader(  
            		ServletActionContext.getServletContext().getRealPath("") + "\\config\\usertree.json"));
			String deleteRet = "";
			String curLine = "";
			while((curLine = inJson.readLine()) != null){
				 if(curLine.equals("{\"pathes\" :[")) {
					 deleteRet=deleteRet+curLine+"\n";
				 }else if(curLine.indexOf("\"path\"") != -1) {
					 JSONObject curJson=new JSONObject(curLine);
					 String path=curJson.getString("path");
					 //System.out.println(path);
					 if(!path.equals(desPath) && path.indexOf(desPath+">") != 0 && path.indexOf(desPath+"*") != 0) {
						 deleteRet = deleteRet + curLine + "\n";
						 //System.out.println(deleteRet);
					 }
					 //System.out.println(path);
				 }else {
					 if(deleteRet.charAt(deleteRet.lastIndexOf("\n")-1)==',') {
						 deleteRet=deleteRet.substring(0,deleteRet.length()-2);
						 deleteRet=deleteRet+"\n";
					 }
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

	public String renameFolderName() {
		result="";
		//System.out.println(getChangeOldFolderName());
		//System.out.println(getChangeNewFolderName());
		int index = getRenameOldFolderName().lastIndexOf("folders");
		String oldName = getRenameOldFolderName().substring(0, index);
		index=oldName.lastIndexOf(">");
		String newName="";
		if(index == -1) {
			newName = getRenameNewFolderName();
		}else {
			newName = oldName.substring(0,index) + ">" + getRenameNewFolderName();
		}
//		System.out.println(oldName);
//		System.out.println(newName);
		try{  
			BufferedReader inJson = new BufferedReader(new FileReader(  
            		ServletActionContext.getServletContext().getRealPath("") + "\\config\\usertree.json"));
			String renameRet = "";
			String curLine = "";
			while((curLine = inJson.readLine()) != null){
				 if(curLine.equals("{\"pathes\" :[")) {
					 renameRet = renameRet + curLine + "\n";
				 }else if(curLine.indexOf("\"path\"") != -1) {
					 JSONObject curJson=new JSONObject(curLine);
					 String path=curJson.getString("path");
					 if(path.equals(newName) || path.indexOf(newName + ">")==0 || path.indexOf(newName + "*")==0) {
						 result="exist";
						 return "success";
					 }
					 if(path.equals(oldName) || path.indexOf(oldName + ">")==0 || path.indexOf(oldName + "*")==0) {
						 path=newName + path.substring(oldName.length(),path.length());
						 //System.out.println(path);
						 JSONObject tmpJson=new JSONObject();
						 tmpJson.put("path", path);
						 renameRet = renameRet + tmpJson.toString() + ",\n";
					 }else {
						 renameRet = renameRet + curLine + "\n";
					 }
				 }else {
					 if(renameRet.charAt(renameRet.lastIndexOf("\n")-1)==',') {
						 renameRet=renameRet.substring(0,renameRet.length()-2);
						 renameRet=renameRet+"\n";
					 }
					 renameRet = renameRet + curLine + "\n";
				 }
			 }
			 inJson.close();
			 BufferedWriter outJson = new BufferedWriter(new FileWriter(  
					 ServletActionContext.getServletContext().getRealPath("") + "\\config\\usertree.json"));
			 outJson.write(renameRet);
			 //System.out.println(deleteRet);
			 outJson.flush();
			 outJson.close();
			 result="complete";
         }catch(JSONException | IOException e) {  
        	e.printStackTrace();
        }
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
}
