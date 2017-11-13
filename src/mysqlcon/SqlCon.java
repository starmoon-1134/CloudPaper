package mysqlcon;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.Statement;

public class SqlCon {
    Connection con =null;
    Statement stat=null;
    ResultSet rs=null;
    
    public SqlCon()
    {
        try
        {
            Class.forName("com.mysql.jdbc.Driver");
            con=DriverManager.getConnection("jdbc:mysql://localhost:3306/cloudpaperdb?useUnicode=true&characterEncoding=UTF-8","cloudpaperamd","cloudpaper");
            //con=DriverManager.getConnection("jdbc:mysql://w.rdc.sae.sina.com.cn/app_bookweb?useUnicode=true&characterEncoding=UTF-8","wxn30xy3mj","wlxh23l01hk04xi4j54kjx4jk53k1xh1myxh342m");
            stat=con.createStatement();
            
        }
        
        catch(Exception e)
        {
            con=null;
        }
    
    }
    
    public ResultSet executeQuery(String sql)
    {
        try
        {
            
            rs=stat.executeQuery(sql);
        
        }
        
        catch(Exception e)
        {
            rs=null;
        }
        return rs;
    }
    
    public int executeUpdate(String sql)
    {
    	int ret=-1;
        try
        {
            ret=stat.executeUpdate(sql);
            return ret;
        }
        catch(Exception e)
        {
            return ret;
        }
    }
    
    public int closeCon() {
    	try {
    		con.close();
    		return 1;
    	}catch(Exception e)
        {
            return 0;
        }
    }
}
