//jQuery.sap.registerModulePath("my.sapui5_components_library", "https://rawgit.com/ysokol/my_sapui5_components_library/master/src/");
/* eslint-disable */
jQuery.sap.registerModulePath("my.sapui5_components_library",
	"https://raw.githubusercontent.com/ysokol/my_sapui5_components_library/master/src/");
jQuery.sap.registerModulePath("my.sap_coder_agro_ui_library",
	"https://raw.githubusercontent.com/ysokol/sap_coder_agro_ui_library/master/src/");

sap.ui.define([
	"sap/ui/core/UIComponent",
	"sap/ui/Device",
	"my/sap_coder_agro_wf_drivers_app/model/models",
	"my/sapui5_components_library/sap/workflow/WorkflowService",
	"my/sapui5_components_library/sap/ui5/UserService"
], function (UIComponent, Device, models, WorkflowService, UserService) {
	"use strict";

	return UIComponent.extend("my.sap_coder_agro_wf_drivers_app.Component", {

		metadata: {
			manifest: "json"
		},

		init: function () {
			this._oInitialised = $.Deferred();
			UIComponent.prototype.init.apply(this, arguments);
			this.getRouter().initialize();
			this.setModel(models.createDeviceModel(), "device");
			this.setModel(this._getContextModel(), "context");
			this.setModel(new sap.ui.model.json.JSONModel());
			this.setModel(models.createODataModel(), "odata");
			this._oWorkflowService = new WorkflowService();
			this._oUserService = new UserService();
			var that = this;
			setTimeout(function() {that._oInitialised.resolve()}, 10000);
			//this._initJsonModelFromWf();
		},
		_getContextModel: function () {
			if (!this.getComponentData) {
				return new sap.ui.model.json.JSONModel(this._getMockData());
			}
			if (!this.getComponentData().startupParameters) {
				return new sap.ui.model.json.JSONModel(this._getMockData());
			}
			this._oStartupParameters = this.getComponentData().startupParameters;
			var taskModel = this._oStartupParameters.taskModel;
			if (!taskModel) {
				return new sap.ui.model.json.JSONModel(this._getMockData());
			}
			var taskData = taskModel.getData();
			this._sTaskId = taskData.InstanceID;
			return new sap.ui.model.json.JSONModel("/bpmworkflowruntime/rest/v1/task-instances/" + this._sTaskId + "/context");

		},
		_getMockData: function () {
			return {
				"oTransportation": {
					"sTransportationNum": "1020",
					"sTransportationPath": "Transportations('1020')"
				}
			};
		}
	});
});