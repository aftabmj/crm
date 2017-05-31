"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var aurelia_framework_1 = require('aurelia-framework');
var aurelia_framework_2 = require('aurelia-framework');
var NonIndividualDetails = (function () {
    function NonIndividualDetails(id, b, f, t, a, l1, l2, c, s, st, p, r) {
        this.id = id;
        this.bank_name = b;
        this.rep_name = f;
        //             this.rep_middle_name= m;
        //             this.rep_last_name= l;
        this.rep_title = t;
        this.address_name = a;
        this.line1 = l1;
        this.line2 = l2;
        this.city = c;
        this.suburb = s;
        this.state = st;
        this.pincode = p;
        this.financial_role = r;
        this.isChosenForMatter = false;
    }
    NonIndividualDetails.prototype.toString = function () {
        return this.isChosenForMatter + '\n' +
            this.bank_name + '\n' +
            this.rep_name + '\n' +
            this.rep_title + '\n' +
            this.address_name + '\n' +
            this.line1 + '\n' +
            this.line2 + '\n' +
            this.city + '\n' +
            this.suburb + '\n' +
            this.state + '\n' +
            this.pincode + '\n' +
            this.financial_role + '\n' +
            this.rep_type_id;
    };
    NonIndividualDetails.prototype.resetDetails = function () {
        //this.id=0;----------------------> not sure about this
        this.rep_name = "";
        this.rep_title = "";
        this.bank_name = "";
        this.address_name = "";
        this.line1 = this.line2 = "";
        this.city = "0";
        this.suburb = "";
        this.state = "";
        this.pincode = "";
        this.financial_role = "";
        this.rep_type_id = 0;
    };
    __decorate([
        aurelia_framework_1.bindable
    ], NonIndividualDetails.prototype, "isChosenForMatter");
    __decorate([
        aurelia_framework_1.bindable
    ], NonIndividualDetails.prototype, "bank_name");
    __decorate([
        aurelia_framework_1.bindable
    ], NonIndividualDetails.prototype, "group_type");
    __decorate([
        aurelia_framework_1.bindable
    ], NonIndividualDetails.prototype, "rep_name");
    __decorate([
        aurelia_framework_1.bindable
    ], NonIndividualDetails.prototype, "rep_title");
    __decorate([
        aurelia_framework_1.bindable
    ], NonIndividualDetails.prototype, "rep_type_id");
    __decorate([
        aurelia_framework_1.bindable
    ], NonIndividualDetails.prototype, "address_name");
    __decorate([
        aurelia_framework_1.bindable
    ], NonIndividualDetails.prototype, "line1");
    __decorate([
        aurelia_framework_1.bindable
    ], NonIndividualDetails.prototype, "line2");
    __decorate([
        aurelia_framework_1.bindable
    ], NonIndividualDetails.prototype, "city");
    __decorate([
        aurelia_framework_1.bindable
    ], NonIndividualDetails.prototype, "suburb");
    __decorate([
        aurelia_framework_1.bindable
    ], NonIndividualDetails.prototype, "state");
    __decorate([
        aurelia_framework_1.bindable
    ], NonIndividualDetails.prototype, "pincode");
    __decorate([
        aurelia_framework_1.bindable
    ], NonIndividualDetails.prototype, "financial_role");
    NonIndividualDetails = __decorate([
        aurelia_framework_1.customElement('nonindividualdetails'),
        aurelia_framework_2.noView
    ], NonIndividualDetails);
    return NonIndividualDetails;
}());
exports.NonIndividualDetails = NonIndividualDetails;
