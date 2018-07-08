//jQuery.sap.registerModulePath("my.sapui5_components_library", "https://rawgit.com/ysokol/my_sapui5_components_library/master/src/");
jQuery.sap.registerModulePath("my.sapui5_components_library", "https://raw.githubusercontent.com/ysokol/my_sapui5_components_library/master/src/");

sap.ui.define([
	"sap/ui/core/UIComponent",
	"sap/ui/Device",
	"my/sap_coder_agro_wf_drivers_app/model/models",
	"my/sapui5_components_library/sap/workflow/WorkflowService",
], function (UIComponent, Device, models, WorkflowService) {
	"use strict";

	return UIComponent.extend("my.sap_coder_agro_wf_drivers_app.Component", {

		metadata: {
			manifest: "json"
		},

		init: function () {
			// call the base component's init function
			UIComponent.prototype.init.apply(this, arguments);

			// enable routing
			this.getRouter().initialize();

			// set the device model
			this.setModel(models.createDeviceModel(), "device");
			
			this._oWorkflowService = new WorkflowService();
			
			this._initJsonModelFromWf();
		},
		_initJsonModelFromWf: function() {
			var startupParameters = this.getComponentData().startupParameters;
			var taskModel = startupParameters.taskModel;
			var oContextModel = null;
			if (taskModel) {
				var taskData = taskModel.getData();
				this._sTaskId = taskData.InstanceID;
				oContextModel = new sap.ui.model.json.JSONModel("/bpmworkflowruntime/rest/v1/task-instances/" + this._sTaskId + "/context");
			} else {
				oContextModel = new sap.ui.model.json.JSONModel(this._getMockData());
			}
			this.setModel(oContextModel);
			sap.ui.getCore().setModel(this.getModel());
		},
		_getMockData: function() {
			return {
				"bApproved": false,
				"bChangesDone": false,
				"sCompanyCode": "RU20",
				"sConditionType": "ZFB1",
				"sRegion": "77",
				"sApprovalGroup": "",
				"sApprover": "",
				"sEmbededUrl": "",
				"sWebUrl": "",
				"sSharePointUniqueId": ""
			};
		}
	});
});