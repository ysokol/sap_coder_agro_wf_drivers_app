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
			this._oYandexMap = new YandexMap();
			$.when(this.getOwnerComponent()._oInitialised)
				.done(() => {
					this.getView().setModel(this.getOwnerComponent().getModel());
					let sTransportationPath = this.getOwnerComponent().getModel("context").getProperty("/").oTransportation.sTransportationPath;
					this.getOwnerComponent().getModel("odata").readExt("/" + sTransportationPath + "/TransportationAssignmentDetails", {
							"?$filter": "TruckDetails/Driver eq '" +
								this.getOwnerComponent()._oUserService.getCurrentUser() + "'",
							"$expand": `TransportationDetails,
										TransportationDetails/ShippingLocationDetails,
										TransportationDetails/ShippingLocationDetails1,
										TruckDetails`
						})
						.then(oData => {
							console.log(JSON.stringify(oData.results[0], null, 3));
							this.getOwnerComponent().getModel().setData(oData.results[0]);
							this.bindView("/");
							this._oYandexMap.initYandexMapsApi().then(() => this.onMapInit("/"));
							
						});
					
				});
		},
		onMapInit: function(sBindingPath) {
			let oTransportationMapViewBuilder = new TransportationMapViewBuilder(this._oYandexMap, this.byId("map").getId(), this.getOwnerComponent()
				.getModel(),
				sBindingPath, this);
			oTransportationMapViewBuilder.buildMapView();
		},
		onAcceptTransportation: function(oEvent) {
		},
		onRejectTransportation: function(oEvent) {
		},
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
		},
	});
});