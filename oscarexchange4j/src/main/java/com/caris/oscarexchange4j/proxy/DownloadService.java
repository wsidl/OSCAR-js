/**
 * CARIS oscar - Open Spatial Component ARchitecture
 * 
 * Copyright 2011 CARIS <http://www.caris.com>
 * 
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 * 	http://www.apache.org/licenses/LICENSE-2.0
 * 
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package com.caris.oscarexchange4j.proxy;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;

import javax.servlet.http.HttpServletRequest;
/**
 * 
 * @author tcoburn
 *
 */
public class DownloadService implements Reader {
	
	private String url;

	public void setUrl(String url) {
		this.url = url;
	}
	
	public String getUrl() {
		return this.url;
	}
	
	public String run() throws Exception {
		URL url = new URL(this.url);

		HttpURLConnection uc = (HttpURLConnection)url.openConnection();
		uc.connect();
		
		        
		String line;
		StringBuffer page= new StringBuffer();

		BufferedReader in = new BufferedReader(new InputStreamReader(uc.getInputStream()));
		while ((line = in.readLine()) != null){
		   page.append(line + "\n");
		}
		return page.toString();
	}

	@Override
	public Response makeRequest(HttpServletRequest httpServletRequest) {
		return null;
	}
}