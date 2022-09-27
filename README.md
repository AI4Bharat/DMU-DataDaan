***
<p align="center">
  <a href="http://20.193.156.27/"><img src="https://github.com/AI4Bharat/DMU-DataDaan/blob/master/docs/images/datadaan-logo.png" alt="Bhashini DataDaan" width="800" height="100"></a>
</p>

<p align="center">
    <em>An open source platform to submit any kind of media files</em>
</p>

<p align="center">
    <a href="https://opensource.org/licenses/MIT" target="_blank">
        <img src="https://img.shields.io/badge/License-MIT-green.svg" alt="License: MIT">
    </a>
</p>

***

## Overview
**`Bhashini DataDaan`** is a portal/platform which enables any government entities or PSUs to submit any kind of media files (audio, video, text, pdf, etc). These can be transformed to rich datasets (Parallel, ASR, OCR, etc) which can be made available in ULCA and in parallel power the ML models.


## General Requirements
* The actual media files should be zipped (zip or gz)
* Platform to support max size of 5GB zip file.
* The metadata file format can be txt file (though it is a free text, we highly encourage to keep it structural & precise)                                                                                            

## API Specs
The APIs used in DataDaan are specified as OpenAPI 3 under <a href="https://app.swaggerhub.com/apis/ulca/datadaan/1.0.0">`SwaggerHub Specs`</a>


## DataDaan Architecture
<p align="center">
  <img src="https://github.com/AI4Bharat/DMU-Datastore/blob/master/docs/images/datadaan-flow.png"  width="800" height="250">
</p>
