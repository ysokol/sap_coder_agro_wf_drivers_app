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
			this._oODataModel = this.getOwnerComponent().getModel();
			this._oYandexMap = new YandexMap();

			this._oYandexMapApiInitialized = $.Deferred();
			this._oViewBinded = $.Deferred();
			$.when(this._oViewBinded, this._oYandexMapApiInitialized)
				.done((sTransporationPath, oYmaps) => this.onMapInit(sTransporationPath));

			this._oYandexMap.initYandexMapsApi().then((oYmaps) => this._oYandexMapApiInitialized.resolve(oYmaps));
			$.when(this.getOwnerComponent()._oInitialised)
				.done(() => this.bindView(this.getOwnerComponent().getModel("context").getProperty("/").oTransportation.sTransportationPath));
			//this._oCalendarModel = new JSONModel();
			//this._oPlanningCalendarService = new PlanningCalendarService();
			//this.getView().setModel(this._oCalendarModel, "Calendar");
			
		},
		onMapInit: function(sTransporationPath) {
			let oTransportationMapViewBuilder = new TransportationMapViewBuilder(this._oYandexMap, this.byId("map").getId(), this.getOwnerComponent().getModel(),
				sTransporationPath, this);
			oTransportationMapViewBuilder.buildMapView();
		},
		onTest: function() {},
		onTransporationRelease: function() {
			let sTransportationPath = this.getView().getBindingContext().getPath();
			this.getOwnerComponent().getModel()
				.callFunctionExt("/ReleaseTransportation", "POST", {
					TransportationNum: this.getOwnerComponent().getModel().getProperty(sTransportationPath + "/TransportationNum")
				}).then(() => this.getOwnerComponent().getModel().refresh(true));
		},
		onTransporationCancel: function() {
			let sTransportationPath = this.getView().getBindingContext().getPath();
			this.getOwnerComponent().getModel()
				.callFunctionExt("/CancelTransportation", "POST", {
					TransportationNum: this.getOwnerComponent().getModel().getProperty(sTransportationPath + "/TransportationNum")
				}).then(() => this.getOwnerComponent().getModel().refresh(true));
		},
		onTransporationSendRequests: function() {
			let sTransportationPath = this.getView().getBindingContext().getPath();
			this.getOwnerComponent().getModel()
				.callFunctionExt("/SendRequests", "POST", {
					TransportationNum: this.getOwnerComponent().getModel().getProperty(sTransportationPath + "/TransportationNum")
				}).then(() => this.getOwnerComponent().getModel().refresh(true));
		},
		onTransporationSave: function() {
			this.getOwnerComponent().getModel().submitChanges();
		},
		onAcceptTruck: function(sTransportation, sTruck) {
			this.getOwnerComponent().getModel()
				.callFunctionExt("/AcceptTransportation", "POST", {
					TransportationNum: sTransportation,
					TruckNum: sTruck
				}).then(() => this.getOwnerComponent().getModel().refresh(true));
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
			this.getOwnerComponent().getModel().readExt("/" + sObjectPath).then(oData => {
				//that._oCalendarModel.setData(that._oPlanningCalendarService.convertTranportations([oData]));
				this.getView().bindElement({
					path: "/" + sObjectPath,
					parameters: {
						expand: `TransportationAssignmentDetails/TruckDetails/CarrierDetails,
										ShippingLocationDetails,ShippingLocationDetails1,TransportationMessageLogDetails,
										TransportationLocationAssignmentDetails/ShippingLocationDetails,TruckDetails`
					}
				});
				this._oViewBinded.resolve("/" + sObjectPath);
			});
		},
		onRouterObjectMatched: function(oEvent) {
			this.bindView(this.getOwnerComponent().getModel("context").getProperty("oTransportation").sTransportationPath);
		},
		onTransportationAssignmentTableRawSelected: function(oEvent) {
			if (oEvent.getSource().getSelectedIndices().includes(oEvent.getParameter("rowIndex"))) {
				this._oODataModel.setProperty(oEvent.getParameter("rowContext").getPath() + "/Selected", true);
			} else {
				this._oODataModel.setProperty(oEvent.getParameter("rowContext").getPath() + "/Selected", false);
			}
		}
	});
});