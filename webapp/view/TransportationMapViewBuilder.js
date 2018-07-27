sap.ui.define([
	"sap/ui/base/Object",
	"my/sapui5_components_library/yandex/maps/YandexMap",
	"my/sapui5_components_library/yandex/maps/MapPlacemark",
	"my/sapui5_components_library/yandex/maps/PlacemarkDetail",
	"my/sapui5_components_library/yandex/maps/PlacemarkAction",
	"my/sapui5_components_library/yandex/maps/MapPlacemarkCollection",
	"my/sapui5_components_library/yandex/maps/MapRoute",
	"my/sap_coder_agro_ui_library/utils/ValueListClassifier"
], function (Object, YandexMap, MapPlacemark, PlacemarkDetail, PlacemarkAction, MapPlacemarkCollection, MapRoute, ValueListClassifier) {
	"use strict";

	// https://tech.yandex.ru/maps/jsbox/2.1/object_manager_spatial
	return Object.extend("my.sap_coder_agro_wf_drivers_app.view.TransportationMapViewBuilder", {
		constructor: function (oYandexMap, sMapControlId, oODataModel, sBindingPath, oController) {
			Object.apply(this);
			this._oYandexMap = oYandexMap;
			this._sMapControlId = sMapControlId;
			this._oODataModel = oODataModel;
			this._sBindingPath = sBindingPath;
			this._oController = oController;
			this._oValueListClassifier = new ValueListClassifier();
		},
		classify: function (iValue) {
			return this._oValueListClassifier.classify(iValue, 10, 30, 60, 120);
		},
		buildMapView: function () {
			this._oYandexMap.init({
				oContext: new sap.ui.model.Context(this._oODataModel, this._sBindingPath),
				sMapControlId: this._sMapControlId,
				oParams: {
					sCenterProperty: "TransportationDetails/ShippingLocationDetails/GeoLocation",
					aPlacemarks: [
						this.createShipFromPlacemark(),
						this.createShipToPlacemark(),
						this.createTruckPlacemark()
					],
					aRoutes: this.createRoutes()
				}
			});
		},
		createRoutes: function () {
			return [
				new MapRoute({
					oMapControl: this._oYandexMap,
					oContext: new sap.ui.model.Context(this._oODataModel, this._sBindingPath),
					oParams: {
						sFromProperty: "TruckDetails/GeoLocation",
						sToProperty: "TransportationDetails/ShippingLocationDetails/GeoLocation",
						sColor: "#696969",
						sActiveColor: "#696969"
					}
				}),
				new MapRoute({
					oMapControl: this._oYandexMap,
					oContext: new sap.ui.model.Context(this._oODataModel, this._sBindingPath),
					oParams: {
						sFromProperty: "TransportationDetails/ShippingLocationDetails/GeoLocation",
						sToProperty: "TransportationDetails/ShippingLocationDetails1/GeoLocation",
						sColor: "#00008B",
						sActiveColor: "#00008B"
					}
				})
			];
		},
		createShipFromPlacemark: function () {
			var that = this;
			return new MapPlacemark({
				oMapControl: this._oYandexMap,
				oContext: new sap.ui.model.Context(this._oODataModel, this._sBindingPath),
				oParams: {
					sGeoLocationProperty: "TransportationDetails/ShippingLocationDetails/GeoLocation",
					sIcon: "/sap/fiori/bpmmyinbox/html5apps/sapcoderagrowfdriversapp/images/farm.png",
					aBottomDetails: [new PlacemarkDetail({
						oContext: new sap.ui.model.Context(this._oODataModel, this._sBindingPath),
						oParams: {
							fnIcon: function (oContext) {
								return (that.classify(oContext.getProperty("LoadQueueTimeMinutes")) === 1) ? "/sap/fiori/bpmmyinbox/html5apps/sapcoderagrowfdriversapp/images/status_1_of_5.png" :
									(that.classify(oContext.getProperty("LoadQueueTimeMinutes")) === 2) ? "/sap/fiori/bpmmyinbox/html5apps/sapcoderagrowfdriversapp/images/status_2_of_5.png" :
									(that.classify(oContext.getProperty("LoadQueueTimeMinutes")) === 3) ? "/sap/fiori/bpmmyinbox/html5apps/sapcoderagrowfdriversapp/images/status_3_of_5.png" :
									(that.classify(oContext.getProperty("LoadQueueTimeMinutes")) === 4) ? "/sap/fiori/bpmmyinbox/html5apps/sapcoderagrowfdriversapp/images/status_4_of_5.png" :
									(that.classify(oContext.getProperty("LoadQueueTimeMinutes")) === 5) ? "/sap/fiori/bpmmyinbox/html5apps/sapcoderagrowfdriversapp/images/status_5_of_5.png" : "/sap/fiori/bpmmyinbox/html5apps/sapcoderagrowfdriversapp/images/unknown.png";
							},
							sIconWidth: "12px",
							sIconHeight: "12px"
						}
					})],
					aRightDetails: [new PlacemarkDetail({
						oContext: new sap.ui.model.Context(this._oODataModel, this._sBindingPath),
						fnIsVisible: function (oContext) {
							return false;
						},
						oParams: {
							sIcon: "/sap/fiori/bpmmyinbox/html5apps/sapcoderagrowfdriversapp/images/checked.png",
							sIconWidth: "10px",
							sIconHeight: "10px"
						}
					})],
					aHintDetails: [new PlacemarkDetail({
						oContext: new sap.ui.model.Context(this._oODataModel, this._sBindingPath),
						oParams: {
							fnText: function (oContext) {
								return "Ship From: " + oContext.getProperty("ShipFrom");
							}
						}
					})],
					aPlacemarkActions: [new PlacemarkAction({
						oContext: new sap.ui.model.Context(this._oODataModel, this._sBindingPath),
						oParams: {
							fnText: function (oContext) {
								return "Location Details";
							},
							fnOnPress: function (
								oContext
							) {
								return that._oController.onNavigateToProducingLocationDetails(oContext.getProperty("").ShippingLocationDetails.__ref);
							}
						}
					})]
				}
			});
		},
		createTruckPlacemark: function () {
			return new MapPlacemark({
				oMapControl: this._oYandexMap,
				oContext: new sap.ui.model.Context(this._oODataModel, this._sBindingPath),
				oParams: {
					sGeoLocationProperty: "TruckDetails/GeoLocation",
					sIcon: "/sap/fiori/bpmmyinbox/html5apps/sapcoderagrowfdriversapp/images/truck_257_136.png",
					aBottomDetails: [],
					aRightDetails: []
				}
			});
		},
		createShipToPlacemark: function () {
			var that = this;
			return new MapPlacemark({
				oMapControl: this._oYandexMap,
				oContext: new sap.ui.model.Context(this._oODataModel, this._sBindingPath),
				oParams: {
					sGeoLocationProperty: "TransportationDetails/ShippingLocationDetails1/GeoLocation",
					sIcon: "/sap/fiori/bpmmyinbox/html5apps/sapcoderagrowfdriversapp/images/warehouse.png",
					aBottomDetails: [new PlacemarkDetail({
						oContext: new sap.ui.model.Context(this._oODataModel, this._sBindingPath),
						oParams: {
							fnIcon: function (oContext) {
								return (that.classify(oContext.getProperty("UnloadQueueTimeMinutes")) === 1) ? "/sap/fiori/bpmmyinbox/html5apps/sapcoderagrowfdriversapp/images/status_1_of_5.png" :
									(that.classify(oContext.getProperty("UnloadQueueTimeMinutes")) === 2) ? "/sap/fiori/bpmmyinbox/html5apps/sapcoderagrowfdriversapp/images/status_2_of_5.png" :
									(that.classify(oContext.getProperty("UnloadQueueTimeMinutes")) === 3) ? "/sap/fiori/bpmmyinbox/html5apps/sapcoderagrowfdriversapp/images/status_3_of_5.png" :
									(that.classify(oContext.getProperty("UnloadQueueTimeMinutes")) === 4) ? "/sap/fiori/bpmmyinbox/html5apps/sapcoderagrowfdriversapp/images/status_4_of_5.png" :
									(that.classify(oContext.getProperty("UnloadQueueTimeMinutes")) === 5) ? "/sap/fiori/bpmmyinbox/html5apps/sapcoderagrowfdriversapp/images/status_5_of_5.png" :
									"/sap/fiori/bpmmyinbox/html5apps/sapcoderagrowfdriversapp/images/unknown.png";
							},
							sIconWidth: "12px",
							sIconHeight: "12px"
						}
					})],
					aRightDetails: [new PlacemarkDetail({
						oContext: new sap.ui.model.Context(this._oODataModel, this._sBindingPath),
						oParams: {
							sIcon: "/sap/fiori/bpmmyinbox/html5apps/sapcoderagrowfdriversapp/images/checked.png",
							sIconWidth: "10px",
							sIconHeight: "10px",
							fnIsVisible: function (oContext) {
								return oContext.getProperty("Status") === "ACCEPTED";
							}
						}
					})],
					aHintDetails: [
						new PlacemarkDetail({
							oContext: new sap.ui.model.Context(this._oODataModel, this._sBindingPath),
							oParams: {
								fnText: function (oContext) {
									return "<b>Shipping Location</b>: " + oContext.getProperty("TransportationDetails/ShipToLocation") +
										" (" + oContext.getProperty("TransportationDetails/ShippingLocationDetails1/Description") + ")";
								}
							}
						}),
						new PlacemarkDetail({
							oContext: new sap.ui.model.Context(this._oODataModel, this._sBindingPath),
							oParams: {
								fnText: function (oContext) {
									return "<b>Processing Time</b>: " + oContext.getProperty("ProcessingTimeMinutes") + " min";
								}
							}
						}),
						new PlacemarkDetail({
							oContext: new sap.ui.model.Context(this._oODataModel, this._sBindingPath),
							oParams: {
								fnText: function (oContext) {
									return "<b>Travel Time</b>: " + oContext.getProperty("TravelTimeMinutes") + " min";
								}
							}
						}),
						new PlacemarkDetail({
							oContext: new sap.ui.model.Context(this._oODataModel, this._sBindingPath),
							oParams: {
								fnText: function (oContext) {
									return "<b>Queue Time</b>: " + oContext.getProperty("UnloadQueueTimeMinutes") + " min";
								}
							}
						}),
						new PlacemarkDetail({
							oContext: new sap.ui.model.Context(this._oODataModel, this._sBindingPath),
							oParams: {
								fnText: function (oContext) {
									return "<b>Unload Time</b>: " + oContext.getProperty("UnloadTimeMinutes") + " min";
								}
							}
						})
					],
					aPlacemarkActions: [new PlacemarkAction({
						oContext: new sap.ui.model.Context(this._oODataModel, this._sBindingPath),
						oParams: {
							fnText: function (oContext) {
								return "Storage Location Details";
							},
							fnOnPress: function (oContext) {
								return that._oController.onNavigateToStorageLocationDetails(oContext.getProperty("").ShippingLocationDetails1.__ref);
							}
						}
					})]
				}
			});
		}
	});
});