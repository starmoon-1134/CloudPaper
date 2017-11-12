package com;  
  
import java.io.BufferedInputStream;  
import java.io.BufferedOutputStream;
import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.File;  
import java.io.FileInputStream;  
import java.io.FileOutputStream;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;
import java.io.InputStream;  
import java.io.OutputStream;  
import java.util.List;  
  
import javax.servlet.ServletContext;  
import javax.servlet.http.HttpServletRequest;  
  
import org.apache.commons.io.FileUtils;  
import org.apache.struts2.ServletActionContext;
import org.json.JSONException;
import org.json.JSONObject;

import com.opensymphony.xwork2.ActionSupport;  
  
/** 
 * @author fish 
 */  
public class UploadFile extends ActionSupport  
{  
    private List<File> Filedata; // 默认的客户端文件对象,命名不符合java规范fileData  
    private List<String> FiledataFileName; // 客户端文件名  
    private List<String> imageContentType; // 客户端文件名类型  
  
    public List<File> getFiledata()  
    {  
        return Filedata;  
    }  
  
    public void setFiledata(List<File> filedata)  
    {  
        Filedata = filedata;  
    }  
  
    public List<String> getFiledataFileName()  
    {  
        return FiledataFileName;  
    }  
  
    public void setFiledataFileName(List<String> filedataFileName)  
    {  
        FiledataFileName = filedataFileName;  
    }  
  
    public List<String> getImageContentType()  
    {  
        return imageContentType;  
    }  
  
    public void setImageContentType(List<String> imageContentType)  
    {  
        this.imageContentType = imageContentType;  
    }  
  
    @Override  
    public String execute() throws Exception  
    {  
        if (Filedata == null || Filedata.size() == 0)  
        {  
            return null;  
        }  
        for (int i = 0; i < Filedata.size(); ++i)  
        {  
        	HttpServletRequest request = ServletActionContext.getRequest(); // 获得ServletRequest对象

    		String userName = request.getParameter("username");
        	String folderPath = request.getParameter("folder");
        	int index = folderPath.lastIndexOf("folders");
   		    folderPath = folderPath.substring(0, index);
    		// 文件真名
    		String fileName = FiledataFileName.get(i);
    		String desPath = folderPath + "*" + fileName;
    		int fileOrderNum=0;
//    		System.out.println(folderPath);
//          System.out.println(fileName);
    		try{  
    			BufferedReader inJson = new BufferedReader(new FileReader(  
                		ServletActionContext.getServletContext().getRealPath("") + "\\config\\usertree.json"));
    			String curLine = "";
    			String findRet="";
    			while((curLine = inJson.readLine()) != null){
    				 if(curLine.equals("{\"pathes\" :[")) {
    					 findRet = findRet+curLine+"\n";
    				 }else if(curLine.indexOf("\"path\"") != -1) {
    					 JSONObject curJson=new JSONObject(curLine);
    					 String path=curJson.getString("path");
    					 if(path.equals(desPath) || path.indexOf(desPath) == 0) {
    						 fileOrderNum++;
    					 }
    					 findRet = findRet+curLine+"\n";
    				 }else {
    					 findRet = findRet.substring(0, findRet.length()-1);
    					 findRet = findRet + ",\n";
    					 JSONObject newJson=new JSONObject();
    					 if(fileOrderNum == 0) {
    						 newJson.put("path", desPath);
    					 }else {
    						 newJson.put("path", desPath + "(" + fileOrderNum + ")");
    					 }
    					 findRet = findRet + newJson.toString() + "\n";
    					 findRet = findRet + curLine + "\n";
    				 }
    			}
    			inJson.close();
    			BufferedWriter outJson = new BufferedWriter(new FileWriter(  
    					 ServletActionContext.getServletContext().getRealPath("") + "\\config\\usertree.json"));
    			outJson.write(findRet);
    			outJson.flush();
    			outJson.close();
    		}catch(JSONException | IOException e) {  
            	e.printStackTrace();
            }    
  
            long length = Filedata.get(i).length(); // 文件的真实大小  
            long time = System.currentTimeMillis();  
  
            // 将上传的文件保存到服务器的硬盘上  
  
            InputStream is = new  BufferedInputStream(new FileInputStream(Filedata.get(i)));  
            
            //request.getRealPath("/")已不建议使用，改为this.getServletContext().getRealPath("/")  
            System.out.println("path:"+ServletActionContext.getServletContext().getRealPath("/"));
            String saveFileName;
            if(fileOrderNum == 0) {
            	saveFileName = fileName;
			 }else {
				saveFileName = fileName + "(" + fileOrderNum + ")";
			 }
            File tempFile = new File(ServletActionContext.getServletContext().getRealPath("/uploadimages")+File.separator+saveFileName);  
  
            FileUtils.forceMkdir(tempFile.getParentFile()); // 创建上传文件所在的父目录  
  
            OutputStream os = new BufferedOutputStream( new FileOutputStream(tempFile));  
  
            int len = 0;  
            byte[] buffer = new byte[500];  
  
            while (-1 != (len = is.read(buffer)))
            {  
                os.write(buffer, 0, len);  
            }  
            is.close();  
            os.flush();  
            os.close();  
        }
        return "success";  
    }  
}