"use strict";

module.exports = {
    deps: ['RenderEngineAdapter', 'Dimensions'],
    type: 'Camera',
    func: function (adapter, Dimensions) {
        return {
            Camera: function () {
                var dims = Dimensions.Dimensions();

                var camera = adapter.newOrthographicCamera(
                    dims.usableWidth / -2,
                    dims.usableWidth / 2,
                    dims.usableHeight / 2,
                    dims.usableHeight / -2,
                    -2000,
                    1000
                );

                adapter.setPosition(camera, {z: 1});
                adapter.setCameraAspectRatio(camera, dims.usableWidth / dims.usableHeight);
                adapter.updateProjectionMatrix(camera);

                return camera;
            }
        };
    }
};