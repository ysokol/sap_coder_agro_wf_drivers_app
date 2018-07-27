sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"my/sap_coder_agro_wf_drivers_app/model/formatter",
	"my/sapui5_components_library/yandex/maps/YandexMap",
	"my/sap_coder_agro_wf_drivers_app/view/TransportationMapViewBuilder"
], function (Controller, JSONModel, formatter, YandexMap, TransportationMapViewBuilder) {
	"use strict";
	/*eslint-env es6*/
	
	return Controller.extend("my.sap_coder_agro_wf_drivers_app.controller.Transportation", {
		formatter: formatter,
		onInit: function () {
			let that = this;
			that._oYandexMap = new YandexMap();
			$.when(that.getOwnerComponent()._oInitialised)
				.done(function () {

					that.getView().setModel(that.getOwnerComponent().getModel());
					var sTransportationPath = that.getOwnerComponent().getModel("context").getProperty("/").oTransportation.sTransportationPath;
					that.getOwnerComponent().getModel("odata").readExt("/" + sTransportationPath + "/TransportationAssignmentDetails", {
							"?$filter": "TruckDetails/Driver eq '" +
								that.getOwnerComponent()._oUserService.getCurrentUser() + "'",
							"$expand": "TransportationDetails,\
										TransportationDetails/ShippingLocationDetails,\
										TransportationDetails/ShippingLocationDetails1,\
										TruckDetails"
						})
						.then(function (oData) {
							that.getOwnerComponent().getModel().setData(oData.results[0]);
							that.bindView("/");
							that._oYandexMap.initYandexMapsApi().then(function () {
								that.onMapInit("/");
							});
							if (that.getOwnerComponent()._oStartupParameters && that.getOwnerComponent()._oStartupParameters.inboxAPI) {
								that.getOwnerComponent()._oStartupParameters.inboxAPI.addAction({
									action: "Reject",
									label: "Reject1"
								}, that.onRejectTransportation, that);
								that.getOwnerComponent()._oStartupParameters.inboxAPI.addAction({
									action: "Accept",
									label: "Accept"
								}, that.onAcceptTransportation, that);
							}
						});
				});
		},
		onMapInit: function (sBindingPath) {
			var oTransportationMapViewBuilder = new TransportationMapViewBuilder(this._oYandexMap, this.byId("map").getId(), this.getOwnerComponent()
				.getModel(),
				sBindingPath, this);
			oTransportationMapViewBuilder.buildMapView();
		},
		onAcceptTransportation: function (oEvent) {
			debugger;
			var that = this;
			that.getOwnerComponent()._oWorkflowService.getTaskDetails(that.getOwnerComponent()._sTaskId)
				.then(function (oTaskDetails) {
					that.getOwnerComponent()._oWorkflowService.patchContext(oTaskDetails.workflowInstanceId, {
						oTransportation: {
							sAcceptedDriver: that.getOwnerComponent()._oUserService.getCurrentUser()
						}
					}).then(function () {
						that.getOwnerComponent()._oWorkflowService.completeTask(that.getOwnerComponent()._sTaskId)
							.then(function () {
								that.getOwnerComponent()._oStartupParameters.inboxAPI.updateTask("NA", that.getOwnerComponent()._sTaskId);
							});
					});
				});
		},
		onRejectTransportation: function (oEvent) {},
		onNavigateToProducingLocationDetails: function (sShippingLocationPath) {
			this.getOwnerComponent().getRouter().navTo("ProducingLocation", {
				sObjectPath: sShippingLocationPath
			});
		},
		onNavigateToTruckDetails: function (sTruckPath) {
			this.getOwnerComponent().getRouter().navTo("Truck", {
				sObjectPath: sTruckPath
			});
		},
		onNavigateToStorageLocationDetails: function (sShippingLocationPath) {
			this.getOwnerComponent().getRouter().navTo("GanttDiagram", {
				sObjectPath: sShippingLocationPath
			});
		},
		bindView: function (sObjectPath) {
			this.getView().bindElement({
				path: sObjectPath
			});
		}
	});
});