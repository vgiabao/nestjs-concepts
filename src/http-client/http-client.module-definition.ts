import { ConfigurableModuleBuilder } from '@nestjs/common'

export interface HttpClientModuleOptions {
    baseUrl?: string;

}

export const { ConfigurableModuleClass, MODULE_OPTIONS_TOKEN: HTTP_MODULE_OPTIONS } = new ConfigurableModuleBuilder<HttpClientModuleOptions>().build()