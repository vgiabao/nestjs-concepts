// Example: How @CommandHandler works internally (simplified)

import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { DiscoveryService, MetadataScanner, Reflector } from '@nestjs/core';

// The decorator that users apply
export const COMMAND_HANDLER_METADATA = 'COMMAND_HANDLER_METADATA';
export const CommandHandler = (command: any): ClassDecorator => {
    return (target: any) => {
        Reflect.defineMetadata(COMMAND_HANDLER_METADATA, command, target);
    };
};

// Example command class
export class CreateUserCommand {
    constructor(public readonly name: string, public readonly email: string) { }
}

// How a developer would use it
@CommandHandler(CreateUserCommand)
export class CreateUserHandler {
    execute(command: CreateUserCommand) {
        console.log(`Creating user: ${command.name} (${command.email})`);
        return { id: Math.random(), ...command };
    }
}

// The internal service that makes it all work (like your IntervalScheduler)
@Injectable()
export class CommandBus implements OnApplicationBootstrap {
    private readonly handlers = new Map<any, any>();

    constructor(
        private readonly discoveryService: DiscoveryService,
        private readonly reflector: Reflector,
    ) { }

    onApplicationBootstrap() {
        // Same pattern as your IntervalScheduler!
        const providers = this.discoveryService.getProviders();

        providers.forEach((wrapper) => {
            const { instance } = wrapper;
            if (!instance) return;

            // Check if this class has @CommandHandler decorator
            const commandType = this.reflector.get(
                COMMAND_HANDLER_METADATA,
                instance.constructor
            );

            if (commandType) {
                // Register this handler for this command type
                this.handlers.set(commandType, instance);
                console.log(`Registered handler for ${commandType.name}`);
            }
        });
    }

    // Public API for dispatching commands
    async execute(command: any) {
        const handler = this.handlers.get(command.constructor);
        if (!handler) {
            throw new Error(`No handler found for ${command.constructor.name}`);
        }

        // Dynamic method invocation - just like your intervalRef!
        return handler.execute(command);
    }
}

// Example usage:
// const result = await commandBus.execute(new CreateUserCommand('John', 'john@example.com'));
