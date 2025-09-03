import { Inject, Injectable, Module } from '@nestjs/common';
import { ConfigurableModuleClass, HttpClientModuleOptions, HTTP_MODULE_OPTIONS } from './http-client.module-definition'

@Module({})
export class HttpClientModule extends ConfigurableModuleClass {
    constructor(@Inject(HTTP_MODULE_OPTIONS) private options) {
        console.log(options);
        super();
    }
}
