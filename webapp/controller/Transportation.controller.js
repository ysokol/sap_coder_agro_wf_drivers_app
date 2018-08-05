sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"my/sap_coder_agro_wf_drivers_app/model/formatter",
	"my/sapui5_components_library/yandex/maps/YandexMap",
	"my/sap_coder_agro_wf_drivers_app/view/TransportationMapViewBuilder"
], function(Controller, JSONModel, formatter, YandexMap, TransportationMapViewBuilder) {
	"use strict";
	/*eslint-env es6*/

	return Controller.extend("my.sap_coder_agro_wf_drivers_app.controller.Transportation", {
		formatter: formatter,
		onInit: function() {
			$.when(this.getOwnerComponent()._oInitialised)
				.done(this.onContextInitialised.bind(this));
		},
		onContextInitialised: function() {
			this._oContextModel = this.getOwnerComponent().getModel("context");
			this._oODataModel = this.getOwnerComponent().getModel("odata");
			this._oViewModel = this.getOwnerComponent().getModel();
			this._sTransporationPath = "/" + this._oContextModel.getProperty("/").oTransportation.sTransportationPath;
			this._sCurrentUser = this.getOwnerComponent()._oUserService.getCurrentUser();
			this._oYandexMap = new YandexMap(this.byId("map").getId());
			Promise.all([
					this._oODataModel.readPromise(this._sTransporationPath + "/TransportationAssignmentDetails", {
						urlParameters: {
							"?$filter": "TruckDetails/Driver eq '" + this._sCurrentUser + "'",
							"$expand": "TransportationDetails,\
										TransportationDetails/ShippingLocationDetails,\
										TransportationDetails/ShippingLocationDetails1,\
										TruckDetails"
						}
					}),
					this._oYandexMap.createMapControl()
				])
				.then(aValues => {
					let oTransportationMapViewBuilder = new TransportationMapViewBuilder(this._oYandexMap, this);
					oTransportationMapViewBuilder.buildMapView();
					this._oViewModel.setData(aValues[0].results[0]);
					this._oYandexMap.bindElement(new sap.ui.model.Context(this._oViewModel, "/"));
				});
			if (this.getOwnerComponent()._oStartupParameters && this.getOwnerComponent()._oStartupParameters.inboxAPI) {
				this.getOwnerComponent()._oStartupParameters.inboxAPI.addAction({
					action: "Reject",
					label: "Reject1"
				}, this.onRejectTransportation, this);
				this.getOwnerComponent()._oStartupParameters.inboxAPI.addAction({
					action: "Accept",
					label: "Accept"
				}, this.onAcceptTransportation, this);
			}
		},
		onMapInit: function(sBindingPath) {
			var oTransportationMapViewBuilder = new TransportationMapViewBuilder(this._oYandexMap, this.byId("map").getId(), this.getOwnerComponent()
				.getModel(),
				sBindingPath, this);
			oTransportationMapViewBuilder.buildMapView();
		},
		onAddRoadEvent: function(oEvent) {
			
		},
		onAcceptTransportation: function(oEvent) {
			var that = this;
			that.getOwnerComponent()._oWorkflowService.getTaskDetails(that.getOwnerComponent()._sTaskId)
				.then(function(oTaskDetails) {
					that.getOwnerComponent()._oWorkflowService.patchContext(oTaskDetails.workflowInstanceId, {
						oTransportation: {
							sAcceptedDriver: that.getOwnerComponent()._oUserService.getCurrentUser()
						}
					}).then(function() {
						that.getOwnerComponent()._oWorkflowService.completeTask(that.getOwnerComponent()._sTaskId)
							.then(function() {
								that.getOwnerComponent()._oStartupParameters.inboxAPI.updateTask("NA", that.getOwnerComponent()._sTaskId);
							});
					});
				});
		},
		onRejectTransportation: function(oEvent) {},
		onNavigateToProducingLocationDetails: function(sShippingLocationPath) {
			this.getOwnerComponent().getRouter().navTo("ProducingLocation", {
				sObjectPath: sShippingLocationPath
			});
		},
		onNavigateToTruckDetails: function(sTruckPath) {
			this.getOwnerComponent().getRouter().navTo("Truck", {
				sObjectPath: sTruckPath
			});
		},
		onNavigateToStorageLocationDetails: function(sShippingLocationPath) {
			this.getOwnerComponent().getRouter().navTo("GanttDiagram", {
				sObjectPath: sShippingLocationPath
			});
		},
		bindView: function(sObjectPath) {
			this.getView().bindElement({
				path: sObjectPath
			});
		}
	});
});