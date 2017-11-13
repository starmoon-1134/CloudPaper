package com;

import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.File;
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
	private String deleteFileName;
	private String deleteFilePath;
	private String renameNewFileName;
	private String renameOldFileName;
	private String renameFilePath;

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

	public String renameFolder() {
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

	public String deleteFile() {
		result="";
//		System.out.println(getDeleteFileName());
//		System.out.println(getDeleteFilePath());
		int index = getDeleteFilePath().lastIndexOf("files");
		String filePath = getDeleteFilePath().substring(0, index);
		String desPath = filePath + "*" + getDeleteFileName();
//		System.out.println(desPath);
		try{  
			BufferedReader inJson = new BufferedReader(new FileReader(  
            		ServletActionContext.getServletContext().getRealPath("") + "\\config\\usertree.json"));
			String curLine = "";
			String deleteRet = "";
			while((curLine = inJson.readLine()) != null){
				 if(curLine.equals("{\"pathes\" :[")) {
					 deleteRet = deleteRet + curLine + "\n";
				 }else if(curLine.indexOf("\"path\"") != -1) {
					 JSONObject curJson=new JSONObject(curLine);
					 String path=curJson.getString("path");
					 if(!path.equals(desPath)) {
						 deleteRet = deleteRet + curLine + "\n";
					 }
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
			 result="complete";
         }catch(JSONException | IOException e) {  
        	e.printStackTrace();
        }
		
		String fileNameString = ServletActionContext.getServletContext().getRealPath("") + 
				"\\uploadimages" + File.separator + getDeleteFileName();
//		System.out.println(fileNameString);
		File tmpFile = new File(fileNameString);
		if (tmpFile.exists()) {
			tmpFile.delete();
		}
		return "success";
	}

	public String renameFile() {
		result="";
		//System.out.println(getChangeOldFolderName());
		//System.out.println(getChangeNewFolderName());
		int index = getRenameFilePath().lastIndexOf("files");
		String filePath = getRenameFilePath().substring(0, index);
		String desPath = filePath + "*" + getRenameOldFileName();
		String newPath = filePath + "*" + getRenameNewFileName() + ".pdf";
//		System.out.println(desPath);
//		System.out.println(newPath);
		int fileOrderNum = 0;
		try{
			BufferedReader inJson = new BufferedReader(new FileReader(
            		ServletActionContext.getServletContext().getRealPath("") + "\\config\\usertree.json"));
			String curLine = "";
			String renameRet = "";
			while((curLine = inJson.readLine()) != null){
				 if(curLine.equals("{\"pathes\" :[")) {
					 renameRet = renameRet + curLine + "\n";
				 }else if(curLine.indexOf("\"path\"") != -1) {
					 JSONObject curJson=new JSONObject(curLine);
					 String path=curJson.getString("path");
					 if(path.equals(newPath) || path.indexOf(newPath) == 0) {
						 fileOrderNum++;
					 }
					 if(!path.equals(desPath)) {
						 renameRet = renameRet + curLine + "\n";
					 }
				 }else {
					 JSONObject newJson=new JSONObject();
					 if(fileOrderNum == 0) {
						 newJson.put("path", newPath);
					 }else {
						 newJson.put("path", newPath + "(" + fileOrderNum + ")");
					 }
					 if(renameRet.charAt(renameRet.lastIndexOf("\n")-1) != ',') {
						 renameRet = renameRet.substring(0,renameRet.length()-1);
						 renameRet = renameRet + ",\n";
					 }
					 renameRet = renameRet + newJson.toString() + "\n";
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
		
		String oldFileName = ServletActionContext.getServletContext().getRealPath("") + 
				"\\uploadimages" + File.separator + getRenameOldFileName();
		String newFileName;
		if(fileOrderNum == 0) {
			newFileName = ServletActionContext.getServletContext().getRealPath("") + 
					"\\uploadimages" + File.separator + getRenameNewFileName() + ".pdf";
		}else {
			newFileName = ServletActionContext.getServletContext().getRealPath("") + 
					"\\uploadimages" + File.separator + getRenameNewFileName() + ".pdf" + "(" + fileOrderNum + ")";
		}
//		System.out.println(oldFileName);
//		System.out.println(newFileName);
		File oldFile = new File(oldFileName);
		File newFile = new File(newFileName);
		if (oldFile.exists()) {
			oldFile.renameTo(newFile);
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
}

