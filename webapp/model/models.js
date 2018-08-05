sap.ui.define([
	"sap/ui/model/json/JSONModel",
	"com/pepsico/core/sap/ui/model/odata/v2/ODataModel",
	"sap/ui/Device"
], function (JSONModel, ODataModelExt, Device) {
	"use strict";

	return {

		createDeviceModel: function () {
			var oModel = new JSONModel(Device);
			oModel.setDefaultBindingMode("OneWay");
			return oModel;
		},

		createODataModel: function (bIsMobileDevice) {
			return new ODataModelExt(
				//"/html5apps/sapcoderagrowfdriversapp/odata", {
				"/odata", {
					json: true,
					useBatch: false,
					defaultBindingMode: sap.ui.model.BindingMode.TwoWay,
					defaultUpdateMethod: sap.ui.model.odata.UpdateMethod.Put,
					loadMetadataAsync: false,
					tokenHandling: true
				}
			);
		}

	};
});