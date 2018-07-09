//jQuery.sap.registerModulePath("my.sapui5_components_library", "https://rawgit.com/ysokol/my_sapui5_components_library/master/src/");
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
], function(UIComponent, Device, models, WorkflowService, UserService) {
	"use strict";

	return UIComponent.extend("my.sap_coder_agro_wf_drivers_app.Component", {

		metadata: {
			manifest: "json"
		},

		init: function() {
			this._oInitialised = $.Deferred();
			UIComponent.prototype.init.apply(this, arguments);
			this.getRouter().initialize();
			this.setModel(models.createDeviceModel(), "device");
			this.setModel(this._initJsonModelFromWf(), "context");
			this.setModel(new sap.ui.model.json.JSONModel());
			this.setModel(models.createODataModel(), "odata");
			this._oWorkflowService = new WorkflowService();
			this._oUserService = new UserService();
			this._oInitialised.resolve();
			//this._initJsonModelFromWf();
		},
		_initJsonModelFromWf: function() {
			/*var startupParameters = this.getComponentData().startupParameters;
			var taskModel = startupParameters.taskModel;
			var oContextModel = null;
			if (taskModel) {
				var taskData = taskModel.getData();
				this._sTaskId = taskData.InstanceID;
				oContextModel = new sap.ui.model.json.JSONModel("/bpmworkflowruntime/rest/v1/task-instances/" + this._sTaskId + "/context");
			} else {*/
			return new sap.ui.model.json.JSONModel(this._getMockData());
			//}
			
			//sap.ui.getCore().setModel(this.getModel(), "context");
		},
		_getMockData: function() {
			return {
				"oTransportation": {
					"sTransportationNum": "1020",
					"sTransportationPath": "Transportations('1020')"
				}
			};
		}
	});
});