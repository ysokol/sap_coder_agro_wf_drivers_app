sap.ui.define([
	"sap/ui/model/json/JSONModel",
	"my/sapui5_components_library/sap/ui5/ODataModelExt",
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
			debugger;
			return new ODataModelExt(
				"/html5apps/sapcoderagrowfdriversapp/odata", {
				//"/odata", {
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