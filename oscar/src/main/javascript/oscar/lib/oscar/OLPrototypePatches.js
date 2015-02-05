/*
 * CARIS oscar - Open Spatial Component ARchitecture
 * 
 * Copyright 2012 CARIS <http://www.caris.com>
 * 
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not
 * use this file except in compliance with the License. You may obtain a copy of
 * the License at
 * 
 * http://www.apache.org/licenses/LICENSE-2.0
 * 
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations under
 * the License.
 */

/**
 * This file contains patches for OpenLayers objects
 */

/**
 * Method: outerBoundaryIs
 * 
 * Reads the outerBoundaryIs node from a GML3 response
 */
OpenLayers.Format.GML.v3.prototype.readers["gml"].outerBoundaryIs = function(node, obj) {
    this.readChildNodes(node, obj);
    obj.outer = obj.components[0];
};

/**
 * Method: LatLongBoundingBox
 * 
 * This method reads the LatLongBoundingBox from a WFS 1.0.0 capabilities file.
 */
OpenLayers.Format.WFSCapabilities.v1_0_0.prototype.readers["wfs"]["LatLongBoundingBox"] = function(node, obj) {
    var boundingBox = {};
    var maxx = node.getAttribute("maxx");
    var maxy = node.getAttribute("maxy");
    var minx = node.getAttribute("minx");
    var miny = node.getAttribute("miny");
    var bounds = new OpenLayers.Bounds(minx, miny, maxx, maxy);
    obj.bounds = bounds;
};

OpenLayers.Format.CSWGetRecords.v2_0_2.prototype.namespaces["gmd"] = "http://www.isotc211.org/2005/gmd";
OpenLayers.Format.CSWGetRecords.v2_0_2.prototype.namespaces["gco"] = "http://www.isotc211.org/2005/gco";
OpenLayers.Format.CSWGetRecords.v2_0_2.prototype.namespaces["gmi"] = "http://www.isotc211.org/2005/gmi";
OpenLayers.Format.CSWGetRecords.v2_0_2.prototype.namespaces["srv"] = "http://www.isotc211.org/2005/srv";
OpenLayers.Format.CSWGetRecords.v2_0_2.prototype.namespaces["dsc"] = "http://www.caris.com/dsc/1.0";
OpenLayers.Format.CSWGetRecords.v2_0_2.prototype.readNode = function(node, obj) {
    if (!obj) {
        obj = {};
    }
    var group = this.readers[node.namespaceURI ? this.namespaceAlias[node.namespaceURI] : this.defaultPrefix];
    if (group) {
        var local = node.localName || node.nodeName.split(":").pop();
        var reader = group[local] || group["*"];
        if (reader) {
            reader.apply(this, [ node, obj ]);
        }
    }
    return obj;
}

OpenLayers.Format.CSWGetRecords.v2_0_2.prototype.nonMappedNodes = function(node) {
    if (!this.errornodes) {
        this.errornodes = [];
    }
    if (node) {
        if ($$.inArray(node.nodeName, this.errornodes) == -1) {
            this.errornodes.push(node.nodeName);
            console.warn(node.parentNode.nodeName + " > " + node.nodeName + " is not mapped.");
        }
    }
}

OpenLayers.Format.CSWGetRecords.v2_0_2.prototype.readers["gmd"] = {
    "MI_Metadata" : function(node, obj) {
        var metadata = {
            type : "MI_Metadata",
            title : [ {
                value : null
            } ]
        };
        metadata["abstract"] = [ "" ];
        this.readChildNodes(node, metadata);
        obj.records.push(metadata);
    },
    "MD_Metadata" : function(node, obj) {
        var metadata = {
            type : "MD_Metadata"
        };
        metadata["abstract"] = [ "" ];
        this.readChildNodes(node, metadata);
        obj.records.push(metadata);
    },
    
    "*" : function(node, obj) {
        var name = node.localName || node.nodeName.split(":").pop();
        obj[name] = {};
        if (node.attributes.length > 0) {
            for (var i = 0; i < node.attributes.length; i++) {
                var attribute = node.attributes[i];
                var attrName = attribute.name;
                obj[name][attrName] = this.getAttributeNS(node, "", attrName);
            }
        }
        this.readChildNodes(node, obj[name]);
        
    },
    
    "fileIdentifier" : function(node, obj) { // contains gco:CharacterString
        // element
        this.readChildNodes(node, obj);
    },
    "identifier" : function(node, obj) {
        this.readChildNodes(node, obj);
    },
    "language" : function(node, obj) {
        this.readChildNodes(node, obj);
    },
    /**
     * LanaguageCode has to attributes: codeList and codeListValue
     */
    "LanguageCode" : function(node, obj) {
        var codeList = this.getAttributeNS(node, "", "codeList");
        var codeListValue = this.getAttributeNS(node, "", "codeListValue");
        obj.language = {};
        obj.language.codeList = codeList;
        obj.language.codeListValue = codeListValue;
    },
    
    "characterSet" : function(node, obj) {
        var CharacterSet = {}
        this.readChildNodes(node, CharacterSet);
        obj.CharacterSet = CharacterSet;
    },
    /**
     * MD_CharacerSetCode has to attributes: codeList and codeListValue
     */
    "MD_CharacterSetCode" : function(node, obj) {
        var codeList = this.getAttributeNS(node, "", "codeList");
        var codeListValue = this.getAttributeNS(node, "", "codeListValue");
        obj.codeList = codeList;
        obj.codeListValue = codeListValue;
    },
    /**
     * MD_ScopeCode has to attributes: codeList and codeListValue
     */
    "hierarchyLevel" : function(node, obj) {
        var ScopeCode = {}
        this.readChildNodes(node, ScopeCode);
        obj.ScopeCode = ScopeCode;
    },
    
    /**
     * MD_ScopeCode has to attributes: codeList and codeListValue
     */
    "MD_ScopeCode" : function(node, obj) {
        var codeList = this.getAttributeNS(node, "", "codeList");
        var codeListValue = this.getAttributeNS(node, "", "codeListValue");
        obj.codeList = codeList;
        obj.codeListValue = codeListValue;
    },
    
    "identificationInfo" : function(node, obj) {
        this.readChildNodes(node, obj);
    },
    "distributionInfo" : function(node, obj) {
        obj.distributionInfo = {};
        this.readChildNodes(node, obj.distributionInfo);
    },
    
    "MD_Distribution" : function(node, obj) {
        this.readChildNodes(node, obj);
    },
    
    "transferOptions" : function(node, obj) {
        if (!obj.transferOptions) {
            obj.transferOptions = [];
        }
        var option = this.readChildNodes(node, {});
        obj.transferOptions.push(option);
    },
    "MD_DigitalTransferOptions" : function(node, obj) {
        obj.digitalTransferOptions
        this.readChildNodes(node, obj);
    },
    "onLine" : function(node, obj) {
        this.readChildNodes(node, obj);
    },
    "CI_OnlineResource" : function(node, obj) {
        this.readChildNodes(node, obj);
    },
    "linkage" : function(node, obj) {
        this.readChildNodes(node, obj);
    },
    
    "contact" : function(node, obj) {
        this.readChildNodes(node, obj);
    },
    "dateStamp" : function(node, obj) {
        this.readChildNodes(node, obj);
    },
    "metadataStandardName" : function(node, obj) {
        this.readChildNodes(node, obj);
    },
    "metadataStandardVersion" : function(node, obj) {
        this.readChildNodes(node, obj);
    },
    "referenceSystemInfo" : function(node, obj) {
        this.readChildNodes(node, obj);
    },
    "date" : function(node, obj) {
        this.readChildNodes(node, obj);
    },
    "abstract" : function(node, obj) {
        this.readChildNodes(node, obj);
    },
    "resourceConstraints" : function(node, obj) {
        this.readChildNodes(node, obj);
    },
    "spatialReferenceType" : function(node, obj) {
        this.readChildNodes(node, obj);
    },
    
    "MD_DataIdentification" : function(node, obj) {
        this.readChildNodes(node, obj);
    },
    "citation" : function(node, obj) {
        this.readChildNodes(node, obj);
    },
    "CI_Citation" : function(node, obj) {
        this.readChildNodes(node, obj);
    },
    "title" : function(node, obj) { // contains gco:CharacterString element
        this.readChildNodes(node, obj);
    },
    "extent" : function(node, obj) {
        this.readChildNodes(node, obj);
    },
    "EX_Extent" : function(node, obj) {
        this.readChildNodes(node, obj);
    },
    "geographicElement" : function(node, obj) {
        this.readChildNodes(node, obj);
    },
    "EX_GeographicBoundingBox" : function(node, obj) {
        var bounds = {
            left : 0,
            right : 0,
            bottom : 0,
            top : 0
        };
        this.readChildNodes(node, bounds);
        obj.bounds = new OpenLayers.Bounds(bounds.left, bounds.bottom, bounds.right, bounds.top);
    },
    "westBoundLongitude" : function(node, obj) {
        var num = {};
        this.readChildNodes(node, num);
        obj.left = num.value;
    },
    "eastBoundLongitude" : function(node, obj) {
        var num = {};
        this.readChildNodes(node, num);
        obj.right = num.value;
    },
    "southBoundLatitude" : function(node, obj) {
        var num = {};
        this.readChildNodes(node, num);
        obj.bottom = num.value;
    },
    "northBoundLatitude" : function(node, obj) {
        var num = {};
        this.readChildNodes(node, num);
        obj.top = num.value;
    },
    "URL" : function(node, obj) {
        obj.URL = this.getChildValue(node);
    }
};

OpenLayers.Format.CSWGetRecords.v2_0_2.prototype.readers["gmi"] = OpenLayers.Format.CSWGetRecords.v2_0_2.prototype.readers["gmd"];
OpenLayers.Format.CSWGetRecords.v2_0_2.prototype.readers["srv"] = {
    "coupledResource" : function(node, obj) {
        if (!obj.coupledResources) {
            obj.coupledResources = [];
        }
        var coupledResource = {};
        this.readChildNodes(node, coupledResource);
        obj.coupledResources.push(coupledResource);
    },
    "SV_CoupledResource" : function(node, obj) {
        this.readChildNodes(node, obj);
    },
    "operationName" : function(node, obj) {// gco:CharacterString
        this.readChildNodes(node, obj);
    },
    "operatesOn" : function(node, obj) {
        if (!obj.operatesOn) {
            obj.operatesOn = [];
        }
        var operatesOn = {
            uuidref : this.getAttributeNS(node, "", "uuidref"),
            href : this.getAttributeNS(node, "http://www.w3.org/1999/xlink", "href")
        }

        obj.operatesOn.push(operatesOn);
        
    },
    "identifier" : function(node, obj) {
        this.readChildNodes(node, obj);
    }
};
OpenLayers.Format.CSWGetRecords.v2_0_2.prototype.readers["srv"]["*"] = OpenLayers.Format.CSWGetRecords.v2_0_2.prototype.readers["gmd"]["*"];

OpenLayers.Format.CSWGetRecords.v2_0_2.prototype.readers["dsc"] = {
    "DiscoveryBriefRecord" : function(node, obj) {
        var record = {
            type : "DiscoveryBriefRecord"
        };
        this.readChildNodes(node, record);
        obj.records.push(record);
    },
    "DiscoverySummaryRecord" : function(node, obj) {
        var record = {
            type : "DiscoverySummaryRecord"
        };
        this.readChildNodes(node, record);
        obj.records.push(record);
    },
    "DiscoveryRecord" : function(node, obj) {
        var record = {
            type : "DiscoveryRecord"
        };
        this.readChildNodes(node, record);
        obj.records.push(record);
    },
    "Link" : function(node, obj) {
        if (!obj.links) {
            obj.links = [];
        }
        var link = {
            protocol : "",
            url : ""
        };
        link.protocol = this.getAttributeNS(node, "", "protocol");
        link.url = this.getChildValue(node);
        obj.links.push(link);
    },
    "DataIdentifier" : function(node, obj) {
        obj.dataIdentifier = this.getChildValue(node);
    }
}

OpenLayers.Format.CSWGetRecords.v2_0_2.prototype.readers["gco"] = {
    "CharacterString" : function(node, obj) {
        var localName = node.parentNode.localName;
        obj[localName] = this.getChildValue(node);
    },
    "Decimal" : function(node, num) {
        var dec = this.getChildValue(node);
        num.value = dec;
    },
    "ScopedName" : function(node, obj) {
        obj.scopedName = this.getChildValue(node);
    },
    "*" : function(node, obj) {
        var localName = node.parentNode.localName;
        obj[localName] = this.getChildValue(node);
    }
};

OpenLayers.Format.CSWGetRecordById = function(options) {
    options = OpenLayers.Util.applyDefaults(options, OpenLayers.Format.CSWGetRecordById.DEFAULTS);
    var cls = OpenLayers.Format.CSWGetRecordById["v" + options.version.replace(/\./g, "_")];
    if (!cls) {
        throw "Unsupported CSWGetRecordById version: " + options.version;
    }
    return new cls(options);
}
OpenLayers.Format.CSWGetRecordById.DEFAULTS = {
    "version" : "2.0.2"
}

OpenLayers.Format.CSWGetRecordById.v2_0_2 = OpenLayers.Class(OpenLayers.Format.CSWGetRecords.v2_0_2, {
    CLASS_NAME : "OpenLayers.Format.CSWGetRecordById"
});
OpenLayers.Format.CSWGetRecordById.v2_0_2.prototype.readers["csw"]["GetRecordByIdResponse"] = function(node, obj) {
    obj.records = [];
    this.readChildNodes(node, obj);
    var version = this.getAttributeNS(node, "", "version");
    if (version != "") {
        obj.version = version;
    }
    obj.record = obj.records[0];
    delete obj.records;
};

// XMLHttpRequest.js Copyright (C) 2010 Sergey Ilinsky (http://www.ilinsky.com)
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
// http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

/**
 * @requires OpenLayers/Request.js
 */

(function() {
    
    // Save reference to earlier defined object implementation (if any)
    var oXMLHttpRequest = window.XMLHttpRequest;
    
    // Define on browser type
    var bGecko = !!window.controllers, bIE = window.document.all && !window.opera, bIE7 = bIE && window.navigator.userAgent.match(/MSIE 7.0/);
    
    // Enables "XMLHttpRequest()" call next to "new XMLHttpReques()"
    function fXMLHttpRequest() {
        this._object = oXMLHttpRequest && !bIE7 ? new oXMLHttpRequest : new window.ActiveXObject("Microsoft.XMLHTTP");
        this._listeners = [];
    }
    ;
    
    // Constructor
    function cXMLHttpRequest() {
        return new fXMLHttpRequest;
    }
    ;
    cXMLHttpRequest.prototype = fXMLHttpRequest.prototype;
    
    // BUGFIX: Firefox with Firebug installed would break pages if not executed
    if (bGecko && oXMLHttpRequest.wrapped)
        cXMLHttpRequest.wrapped = oXMLHttpRequest.wrapped;
    
    // Constants
    cXMLHttpRequest.UNSENT = 0;
    cXMLHttpRequest.OPENED = 1;
    cXMLHttpRequest.HEADERS_RECEIVED = 2;
    cXMLHttpRequest.LOADING = 3;
    cXMLHttpRequest.DONE = 4;
    
    // Public Properties
    cXMLHttpRequest.prototype.readyState = cXMLHttpRequest.UNSENT;
    cXMLHttpRequest.prototype.responseText = '';
    cXMLHttpRequest.prototype.responseXML = null;
    cXMLHttpRequest.prototype.status = 0;
    cXMLHttpRequest.prototype.statusText = '';
    
    // Priority proposal
    cXMLHttpRequest.prototype.priority = "NORMAL";
    
    // Instance-level Events Handlers
    cXMLHttpRequest.prototype.onreadystatechange = null;
    
    // Class-level Events Handlers
    cXMLHttpRequest.onreadystatechange = null;
    cXMLHttpRequest.onopen = null;
    cXMLHttpRequest.onsend = null;
    cXMLHttpRequest.onabort = null;
    
    // Public Methods
    cXMLHttpRequest.prototype.open = function(sMethod, sUrl, bAsync, sUser, sPassword) {
        // Delete headers, required when object is reused
        delete this._headers;
        
        // When bAsync parameter value is omitted, use true as default
        if (arguments.length < 3)
            bAsync = true;
        
        // Save async parameter for fixing Gecko bug with missing
        // readystatechange in synchronous requests
        this._async = bAsync;
        
        // Set the onreadystatechange handler
        var oRequest = this, nState = this.readyState, fOnUnload;
        
        // BUGFIX: IE - memory leak on page unload (inter-page leak)
        if (bIE && bAsync) {
            fOnUnload = function() {
                if (nState != cXMLHttpRequest.DONE) {
                    fCleanTransport(oRequest);
                    // Safe to abort here since onreadystatechange handler
                    // removed
                    oRequest.abort();
                }
            };
            window.attachEvent("onunload", fOnUnload);
        }
        
        // Add method sniffer
        if (cXMLHttpRequest.onopen)
            cXMLHttpRequest.onopen.apply(this, arguments);
        
        if (arguments.length > 4)
            this._object.open(sMethod, sUrl, bAsync, sUser, sPassword);
        else if (arguments.length > 3)
            this._object.open(sMethod, sUrl, bAsync, sUser);
        else
            this._object.open(sMethod, sUrl, bAsync);
        
        try {
            this._object.responseType = "msxml-document";
        } catch (err) {
            // don't do anything because IE might break
        }
        
        this.readyState = cXMLHttpRequest.OPENED;
        fReadyStateChange(this);
        
        this._object.onreadystatechange = function() {
            if (bGecko && !bAsync)
                return;
            
            // Synchronize state
            oRequest.readyState = oRequest._object.readyState;
            
            //
            fSynchronizeValues(oRequest);
            
            // BUGFIX: Firefox fires unnecessary DONE when aborting
            if (oRequest._aborted) {
                // Reset readyState to UNSENT
                oRequest.readyState = cXMLHttpRequest.UNSENT;
                
                // Return now
                return;
            }
            
            if (oRequest.readyState == cXMLHttpRequest.DONE) {
                // Free up queue
                delete oRequest._data;
                /*
                 * if (bAsync) fQueue_remove(oRequest);
                 */
                //
                fCleanTransport(oRequest);
                // Uncomment this block if you need a fix for IE cache
                /*
                 * // BUGFIX: IE - cache issue if
                 * (!oRequest._object.getResponseHeader("Date")) { // Save
                 * object to cache oRequest._cached = oRequest._object; //
                 * Instantiate a new transport object
                 * cXMLHttpRequest.call(oRequest); // Re-send request if (sUser) {
                 * if (sPassword) oRequest._object.open(sMethod, sUrl, bAsync,
                 * sUser, sPassword); else oRequest._object.open(sMethod, sUrl,
                 * bAsync, sUser); } else oRequest._object.open(sMethod, sUrl,
                 * bAsync);
                 * oRequest._object.setRequestHeader("If-Modified-Since",
                 * oRequest._cached.getResponseHeader("Last-Modified") || new
                 * window.Date(0)); // Copy headers set if (oRequest._headers)
                 * for (var sHeader in oRequest._headers) if (typeof
                 * oRequest._headers[sHeader] == "string") // Some frameworks
                 * prototype objects with functions
                 * oRequest._object.setRequestHeader(sHeader,
                 * oRequest._headers[sHeader]);
                 * 
                 * oRequest._object.onreadystatechange = function() { //
                 * Synchronize state oRequest.readyState =
                 * oRequest._object.readyState;
                 * 
                 * if (oRequest._aborted) { // oRequest.readyState =
                 * cXMLHttpRequest.UNSENT; // Return return; }
                 * 
                 * if (oRequest.readyState == cXMLHttpRequest.DONE) { // Clean
                 * Object fCleanTransport(oRequest); // get cached request if
                 * (oRequest.status == 304) oRequest._object = oRequest._cached; //
                 * delete oRequest._cached; // fSynchronizeValues(oRequest); //
                 * fReadyStateChange(oRequest); // BUGFIX: IE - memory leak in
                 * interrupted if (bIE && bAsync) window.detachEvent("onunload",
                 * fOnUnload); } }; oRequest._object.send(null); // Return now -
                 * wait until re-sent request is finished return; };
                 */
                // BUGFIX: IE - memory leak in interrupted
                if (bIE && bAsync)
                    window.detachEvent("onunload", fOnUnload);
            }
            
            // BUGFIX: Some browsers (Internet Explorer, Gecko) fire OPEN
            // readystate twice
            if (nState != oRequest.readyState)
                fReadyStateChange(oRequest);
            
            nState = oRequest.readyState;
        }
    };
    function fXMLHttpRequest_send(oRequest) {
        oRequest._object.send(oRequest._data);
        
        // BUGFIX: Gecko - missing readystatechange calls in synchronous
        // requests
        if (bGecko && !oRequest._async) {
            oRequest.readyState = cXMLHttpRequest.OPENED;
            
            // Synchronize state
            fSynchronizeValues(oRequest);
            
            // Simulate missing states
            while (oRequest.readyState < cXMLHttpRequest.DONE) {
                oRequest.readyState++;
                fReadyStateChange(oRequest);
                // Check if we are aborted
                if (oRequest._aborted)
                    return;
            }
        }
    }
    ;
    cXMLHttpRequest.prototype.send = function(vData) {
        // Add method sniffer
        if (cXMLHttpRequest.onsend)
            cXMLHttpRequest.onsend.apply(this, arguments);
        
        if (!arguments.length)
            vData = null;
        
        // BUGFIX: Safari - fails sending documents created/modified
        // dynamically, so an explicit serialization required
        // BUGFIX: IE - rewrites any custom mime-type to "text/xml" in case an
        // XMLNode is sent
        // BUGFIX: Gecko - fails sending Element (this is up to the
        // implementation either to standard)
        if (vData && vData.nodeType) {
            vData = window.XMLSerializer ? new window.XMLSerializer().serializeToString(vData) : vData.xml;
            if (!this._headers["Content-Type"])
                this._object.setRequestHeader("Content-Type", "application/xml");
        }
        
        this._data = vData;
        /*
         * // Add to queue if (this._async) fQueue_add(this); else
         */
        fXMLHttpRequest_send(this);
    };
    cXMLHttpRequest.prototype.abort = function() {
        // Add method sniffer
        if (cXMLHttpRequest.onabort)
            cXMLHttpRequest.onabort.apply(this, arguments);
        
        // BUGFIX: Gecko - unnecessary DONE when aborting
        if (this.readyState > cXMLHttpRequest.UNSENT)
            this._aborted = true;
        
        this._object.abort();
        
        // BUGFIX: IE - memory leak
        fCleanTransport(this);
        
        this.readyState = cXMLHttpRequest.UNSENT;
        
        delete this._data;
        /*
         * if (this._async) fQueue_remove(this);
         */
    };
    cXMLHttpRequest.prototype.getAllResponseHeaders = function() {
        return this._object.getAllResponseHeaders();
    };
    cXMLHttpRequest.prototype.getResponseHeader = function(sName) {
        return this._object.getResponseHeader(sName);
    };
    cXMLHttpRequest.prototype.setRequestHeader = function(sName, sValue) {
        // BUGFIX: IE - cache issue
        if (!this._headers)
            this._headers = {};
        this._headers[sName] = sValue;
        
        return this._object.setRequestHeader(sName, sValue);
    };
    
    // EventTarget interface implementation
    cXMLHttpRequest.prototype.addEventListener = function(sName, fHandler, bUseCapture) {
        for (var nIndex = 0, oListener; oListener = this._listeners[nIndex]; nIndex++)
            if (oListener[0] == sName && oListener[1] == fHandler && oListener[2] == bUseCapture)
                return;
        // Add listener
        this._listeners.push([ sName, fHandler, bUseCapture ]);
    };
    
    cXMLHttpRequest.prototype.removeEventListener = function(sName, fHandler, bUseCapture) {
        for (var nIndex = 0, oListener; oListener = this._listeners[nIndex]; nIndex++)
            if (oListener[0] == sName && oListener[1] == fHandler && oListener[2] == bUseCapture)
                break;
        // Remove listener
        if (oListener)
            this._listeners.splice(nIndex, 1);
    };
    
    cXMLHttpRequest.prototype.dispatchEvent = function(oEvent) {
        var oEventPseudo = {
            'type' : oEvent.type,
            'target' : this,
            'currentTarget' : this,
            'eventPhase' : 2,
            'bubbles' : oEvent.bubbles,
            'cancelable' : oEvent.cancelable,
            'timeStamp' : oEvent.timeStamp,
            'stopPropagation' : function() {
            }, // There is no flow
            'preventDefault' : function() {
            }, // There is no default action
            'initEvent' : function() {
            } // Original event object should be initialized
        };
        
        // Execute onreadystatechange
        if (oEventPseudo.type == "readystatechange" && this.onreadystatechange)
            (this.onreadystatechange.handleEvent || this.onreadystatechange).apply(this, [ oEventPseudo ]);
        
        // Execute listeners
        for (var nIndex = 0, oListener; oListener = this._listeners[nIndex]; nIndex++)
            if (oListener[0] == oEventPseudo.type && !oListener[2])
                (oListener[1].handleEvent || oListener[1]).apply(this, [ oEventPseudo ]);
    };
    
    //
    cXMLHttpRequest.prototype.toString = function() {
        return '[' + "object" + ' ' + "XMLHttpRequest" + ']';
    };
    
    cXMLHttpRequest.toString = function() {
        return '[' + "XMLHttpRequest" + ']';
    };
    
    // Helper function
    function fReadyStateChange(oRequest) {
        // Sniffing code
        if (cXMLHttpRequest.onreadystatechange)
            cXMLHttpRequest.onreadystatechange.apply(oRequest);
        
        // Fake event
        oRequest.dispatchEvent({
            'type' : "readystatechange",
            'bubbles' : false,
            'cancelable' : false,
            'timeStamp' : new Date + 0
        });
    }
    ;
    
    function fGetDocument(oRequest) {
        var oDocument = oRequest.responseXML, sResponse = oRequest.responseText;
        // Try parsing responseText
        if (bIE && sResponse && oDocument && !oDocument.documentElement && oRequest.getResponseHeader("Content-Type").match(/[^\/]+\/[^\+]+\+xml/)) {
            oDocument = new window.ActiveXObject("Microsoft.XMLDOM");
            oDocument.async = false;
            oDocument.validateOnParse = false;
            oDocument.loadXML(sResponse);
        }
        // Check if there is no error in document
        if (oDocument)
            if ((bIE && oDocument.parseError != 0) || !oDocument.documentElement || (oDocument.documentElement && oDocument.documentElement.tagName == "parsererror"))
                return null;
        return oDocument;
    }
    ;
    
    function fSynchronizeValues(oRequest) {
        try {
            oRequest.responseText = oRequest._object.responseText;
        } catch (e) {
        }
        try {
            oRequest.responseXML = fGetDocument(oRequest._object);
        } catch (e) {
        }
        try {
            oRequest.status = oRequest._object.status;
        } catch (e) {
        }
        try {
            oRequest.statusText = oRequest._object.statusText;
        } catch (e) {
        }
    }
    ;
    
    function fCleanTransport(oRequest) {
        // BUGFIX: IE - memory leak (on-page leak)
        oRequest._object.onreadystatechange = new window.Function;
    }
    ;
    
    // Internet Explorer 5.0 (missing apply)
    if (!window.Function.prototype.apply) {
        window.Function.prototype.apply = function(oRequest, oArguments) {
            if (!oArguments)
                oArguments = [];
            oRequest.__func = this;
            oRequest.__func(oArguments[0], oArguments[1], oArguments[2], oArguments[3], oArguments[4]);
            delete oRequest.__func;
        };
    }
    ;
    
    // Register new object with window
    /**
     * Class: OpenLayers.Request.XMLHttpRequest Standard-compliant (W3C)
     * cross-browser implementation of the XMLHttpRequest object. From
     * http://code.google.com/p/xmlhttprequest/.
     */
    if (!OpenLayers.Request) {
        /**
         * This allows for OpenLayers/Request.js to be included before or after
         * this script.
         */
        OpenLayers.Request = {};
    }
    OpenLayers.Request.XMLHttpRequest = cXMLHttpRequest;
})();

/**
 * Checking for function availability for IE8
 */
if (!Function.prototype.bind) {
    Function.prototype.bind = function(oThis) {
        if (typeof this !== "function") {
            // closest thing possible to the ECMAScript 5 internal IsCallable
            // function
            throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable");
        }
        
        var aArgs = Array.prototype.slice.call(arguments, 1), fToBind = this, fNOP = function() {
        }, fBound = function() {
            return fToBind.apply(this instanceof fNOP && oThis ? this : oThis, aArgs.concat(Array.prototype.slice.call(arguments)));
        };
        
        fNOP.prototype = this.prototype;
        fBound.prototype = new fNOP();
        
        return fBound;
    };
}
// Override the default value for these OL objects.
OpenLayers.Control.Measure.prototype.geodesic = true;
OpenLayers.Control.ScaleLine.prototype.geodesic = true;
