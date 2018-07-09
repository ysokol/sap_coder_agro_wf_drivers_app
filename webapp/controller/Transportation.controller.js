sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"my/sap_coder_agro_wf_drivers_app/model/formatter",
	"my/sapui5_components_library/yandex/maps/YandexMap",
	"my/sap_coder_agro_wf_drivers_app/view/TransportationMapViewBuilder"
], function (Controller, JSONModel, formatter, YandexMap, TransportationMapViewBuilder) {
	"use strict";



	return Controller.extend("my.sap_coder_agro_wf_drivers_app.controller.Transportation", {
		formatter: formatter,
		onInit: function () {
			var that = this;
			that._oYandexMap = new YandexMap();
			$.when(that.getOwnerComponent()._oInitialised)
				.done(function() {
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
							that._oYandexMap.initYandexMapsApi().then(function() {that.onMapInit("/");});
							if (that.getOwnerComponent()._oStartupParameters) {
								that.getOwnerComponent()._oStartupParameters.inboxAPI.addAction({
									action: "Reject",
									label: "Reject"
								}, that.onRejectTransportation, that);
								that.getOwnerComponent()._startupParameters.inboxAPI.addAction({
									action: "Approve",
									label: "Approve"
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
		onAcceptTransportation: function (oEvent) {},
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