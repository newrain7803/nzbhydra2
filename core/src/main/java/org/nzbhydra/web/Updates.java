package org.nzbhydra.web;

import lombok.AllArgsConstructor;
import lombok.Data;
import org.nzbhydra.GenericResponse;
import org.nzbhydra.update.UpdateManager;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.annotation.Secured;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class Updates {

    private static final Logger logger = LoggerFactory.getLogger(Updates.class);

    @Autowired
    private UpdateManager updateManager;

    @Secured({"ROLE_ADMIN"})
    @RequestMapping(value = "/internalapi/updates/versions", method = RequestMethod.GET)
    public VersionsInfo getVersions() throws Exception {
        //TODO Handle exception better?
        String currentVersion = updateManager.getCurrentVersionString();
        String latestVersion = updateManager.getLatestVersionString();
        boolean isUpdateAvailable = updateManager.isUpdateAvailable();
        return new VersionsInfo(currentVersion, latestVersion, isUpdateAvailable);
    }

    @Secured({"ROLE_ADMIN"})
    @RequestMapping(value = "/internalapi/updates/changesSince", method = RequestMethod.GET)
    public GenericResponse getChangesSince() throws Exception {
        return new GenericResponse(true, updateManager.getChangesSince());
    }

    @Secured({"ROLE_ADMIN"})
    @RequestMapping(value = "/internalapi/updates/versionHistory", method = RequestMethod.GET)
    public GenericResponse getVersionHistory() throws Exception {
        return new GenericResponse(true, updateManager.getFullChangelog());
    }


    @Data
    @AllArgsConstructor
    public class VersionsInfo {
        private String currentVersion;
        private String latestVersion;
        private boolean updateAvailable;
    }


}
